import { supabase } from "@/lib/supabase";
import { WorkoutSession, CompletedExercise, CompletedSet } from "@/types";

export interface StartWorkoutSessionData {
  userId: string;
  workoutPlanId?: string;
  workoutDayId?: string;
  date?: string;
}

export interface CompleteWorkoutSessionData {
  sessionId: string;
  endTime: string;
  duration: number;
  difficulty: "too-easy" | "just-right" | "too-hard";
  notes?: string;
  exercises: CompletedExercise[];
}

export interface UpdateSetData {
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight?: number;
  restTime?: number;
  completed: boolean;
}

export async function startWorkoutSession(data: StartWorkoutSessionData) {
  try {
    const { data: sessionData, error } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: data.userId,
        workout_plan_id: data.workoutPlanId,
        workout_day_id: data.workoutDayId,
        date: data.date || new Date().toISOString().split("T")[0],
        start_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to start workout session: ${error.message}`);
    }

    return { success: true, session: sessionData };
  } catch (error) {
    console.error("Failed to start workout session:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to start workout session",
    };
  }
}

export async function completeWorkoutSession(data: CompleteWorkoutSessionData) {
  try {
    // Update the workout session
    const { error: sessionError } = await supabase
      .from("workout_sessions")
      .update({
        end_time: data.endTime,
        duration: data.duration,
        difficulty: data.difficulty,
        notes: data.notes,
      })
      .eq("id", data.sessionId);

    if (sessionError) {
      throw new Error(
        `Failed to complete workout session: ${sessionError.message}`
      );
    }

    // Save completed exercises and sets
    for (const exercise of data.exercises) {
      const { data: completedExerciseData, error: exerciseError } =
        await supabase
          .from("completed_exercises")
          .insert({
            workout_session_id: data.sessionId,
            exercise_id: exercise.exerciseId,
            order_index: data.exercises.indexOf(exercise),
          })
          .select()
          .single();

      if (exerciseError) {
        throw new Error(
          `Failed to save completed exercise: ${exerciseError.message}`
        );
      }

      // Save completed sets
      const setInserts = exercise.sets.map((set, index) => ({
        completed_exercise_id: completedExerciseData.id,
        set_number: index + 1,
        reps: set.reps,
        weight: set.weight,
        rest_time: set.restTime,
        completed: set.completed,
      }));

      const { error: setsError } = await supabase
        .from("completed_sets")
        .insert(setInserts);

      if (setsError) {
        throw new Error(`Failed to save completed sets: ${setsError.message}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to complete workout session:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to complete workout session",
    };
  }
}

export async function updateWorkoutSet(data: UpdateSetData) {
  try {
    // First, find or create the completed exercise
    let { data: completedExercise, error: findError } = await supabase
      .from("completed_exercises")
      .select("id")
      .eq("workout_session_id", data.sessionId)
      .eq("exercise_id", data.exerciseId)
      .single();

    if (findError && findError.code === "PGRST116") {
      // Create completed exercise if it doesn't exist
      const { data: newCompletedExercise, error: createError } = await supabase
        .from("completed_exercises")
        .insert({
          workout_session_id: data.sessionId,
          exercise_id: data.exerciseId,
          order_index: 0,
        })
        .select()
        .single();

      if (createError) {
        throw new Error(
          `Failed to create completed exercise: ${createError.message}`
        );
      }
      completedExercise = newCompletedExercise;
    } else if (findError) {
      throw new Error(
        `Failed to find completed exercise: ${findError.message}`
      );
    }

    // Find existing set for this exercise and set_number
    const { data: existingSet, error: findSetError } = await supabase
      .from("completed_sets")
      .select("id")
      .eq("completed_exercise_id", completedExercise!.id)
      .eq("set_number", data.setNumber)
      .maybeSingle?.()
      // Fallback for older clients without maybeSingle
      || await supabase
        .from("completed_sets")
        .select("id")
        .eq("completed_exercise_id", completedExercise!.id)
        .eq("set_number", data.setNumber)
        .single();

    if (findSetError && findSetError.code !== "PGRST116") {
      throw new Error(`Failed to query existing set: ${findSetError.message}`);
    }

    if (existingSet && "id" in existingSet) {
      // Update existing set
      const { error: updateSetError } = await supabase
        .from("completed_sets")
        .update({
          reps: data.reps,
          weight: data.weight,
          rest_time: data.restTime,
          completed: data.completed,
        })
        .eq("id", existingSet.id);

      if (updateSetError) {
        throw new Error(`Failed to update set: ${updateSetError.message}`);
      }
    } else {
      // Insert new set
      const { error: insertSetError } = await supabase.from("completed_sets").insert({
        completed_exercise_id: completedExercise!.id,
        set_number: data.setNumber,
        reps: data.reps,
        weight: data.weight,
        rest_time: data.restTime,
        completed: data.completed,
      });

      if (insertSetError) {
        throw new Error(`Failed to insert set: ${insertSetError.message}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update workout set:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update set",
    };
  }
}

export async function getActiveWorkoutSession(userId: string) {
  try {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(
        `
        *,
        workout_plans(name, goal),
        workout_days(name, day_of_week),
        completed_exercises(
          *,
          exercises(name, name_filipino),
          completed_sets(*)
        )
      `
      )
      .eq("user_id", userId)
      .is("end_time", null)
      .order("start_time", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get active workout session: ${error.message}`);
    }

    return { success: true, session: data || null };
  } catch (error) {
    console.error("Failed to get active workout session:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get active workout session",
      session: null,
    };
  }
}

export async function getWorkoutSessionHistory(userId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(
        `
        *,
        workout_plans(name, goal),
        workout_days(name, day_of_week),
        completed_exercises(
          *,
          exercises(name, name_filipino),
          completed_sets(*)
        )
      `
      )
      .eq("user_id", userId)
      .not("end_time", "is", null)
      .order("date", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(
        `Failed to get workout session history: ${error.message}`
      );
    }

    return { success: true, sessions: data || [] };
  } catch (error) {
    console.error("Failed to get workout session history:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get workout session history",
      sessions: [],
    };
  }
}

export async function cancelWorkoutSession(sessionId: string) {
  try {
    const { error } = await supabase
      .from("workout_sessions")
      .delete()
      .eq("id", sessionId)
      .is("end_time", null);

    if (error) {
      throw new Error(`Failed to cancel workout session: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel workout session:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to cancel workout session",
    };
  }
}
