import { supabase } from '@/lib/supabase';
import { WorkoutPlan } from '@/types';

export async function saveWorkoutPlan(workoutPlan: WorkoutPlan) {
  try {
    
    // First, save the workout plan
    const { data: planData, error: planError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: workoutPlan.userId,
        name: workoutPlan.name,
        goal: workoutPlan.goal,
        duration_weeks: workoutPlan.duration,
        equipment: [], // Will be inferred from exercises
        difficulty: 'beginner', // Will be determined from user profile
        is_active: true,
      })
      .select()
      .single();

    if (planError) {
      throw new Error(`Failed to save workout plan: ${planError.message}`);
    }

    const workoutPlanId = planData.id;

    // Save workout days and exercises
    for (const day of workoutPlan.schedule) {
      const { data: dayData, error: dayError } = await supabase
        .from('workout_days')
        .insert({
          workout_plan_id: workoutPlanId,
          day_of_week: day.dayOfWeek,
          name: getDayName(day.dayOfWeek, workoutPlan.schedule),
          estimated_duration: day.estimatedDuration,
        })
        .select()
        .single();

      if (dayError) {
        throw new Error(`Failed to save workout day: ${dayError.message}`);
      }

      // Save exercises for this day
      const exerciseInserts = day.exercises.map((exercise, index) => ({
        workout_day_id: dayData.id,
        exercise_id: exercise.exerciseId,
        sets: exercise.sets,
        reps: exercise.reps.toString(),
        weight: exercise.weight,
        rest_period: exercise.restPeriod,
        order_index: index,
        notes: exercise.notes,
      }));

      const { error: exerciseError } = await supabase
        .from('workout_exercises')
        .insert(exerciseInserts);

      if (exerciseError) {
        throw new Error(`Failed to save workout exercises: ${exerciseError.message}`);
      }
    }

    return { success: true, planId: workoutPlanId };
  } catch (error) {
    console.error('Failed to save workout plan:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save workout plan' 
    };
  }
}

function getDayName(dayOfWeek: number, schedule: any[]): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Find if there are multiple workouts on different days with same muscle groups
  const sameTypeWorkouts = schedule.filter(day => day.dayOfWeek !== dayOfWeek);
  
  if (sameTypeWorkouts.length > 0) {
    const workoutIndex = schedule.findIndex(day => day.dayOfWeek === dayOfWeek);
    return `${dayNames[dayOfWeek]} Workout ${String.fromCharCode(65 + workoutIndex)}`; // A, B, C, etc.
  }
  
  return dayNames[dayOfWeek];
}