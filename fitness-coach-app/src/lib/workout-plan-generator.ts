import { supabase } from '@/lib/supabase';
import { exerciseService } from '@/lib/exercise-service';
import { Exercise, UserProfile, WorkoutPlan, WorkoutDay, WorkoutExercise } from '@/types';

export interface WorkoutPlanGenerationOptions {
  userProfile: UserProfile;
  planName?: string;
  durationWeeks?: number;
}

export interface WorkoutSplit {
  type: 'full-body' | 'upper-lower' | 'push-pull-legs' | 'bro-split';
  days: WorkoutSplitDay[];
}

export interface WorkoutSplitDay {
  name: string;
  muscleGroups: string[];
  dayOfWeek: number;
}

export class WorkoutPlanGenerator {
  private supabase = supabase;

  /**
   * Generate a complete workout plan based on user profile
   */
  async generateWorkoutPlan(options: WorkoutPlanGenerationOptions): Promise<WorkoutPlan> {
    const { userProfile, planName, durationWeeks = 8 } = options;

    // Determine workout split based on frequency
    const workoutSplit = this.determineWorkoutSplit(userProfile.workoutFrequency);
    
    // Get suitable exercises based on equipment and goal
    const availableExercises = await this.getAvailableExercises(
      userProfile.availableEquipment,
      userProfile.goal,
      this.getUserDifficulty(userProfile)
    );

    // Generate workout days
    const workoutDays = await this.generateWorkoutDays(
      workoutSplit,
      availableExercises,
      userProfile
    );

    // Create the workout plan
    const workoutPlan: WorkoutPlan = {
      id: '', // Will be set when saved to database
      userId: userProfile.userId,
      name: planName || this.generatePlanName(userProfile.goal, workoutSplit.type),
      schedule: workoutDays,
      duration: durationWeeks,
      goal: userProfile.goal,
    };

    return workoutPlan;
  }

  /**
   * Save workout plan to database
   */
  async saveWorkoutPlan(workoutPlan: WorkoutPlan): Promise<string> {
    // First, save the workout plan
    const { data: planData, error: planError } = await this.supabase
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
      const { data: dayData, error: dayError } = await this.supabase
        .from('workout_days')
        .insert({
          workout_plan_id: workoutPlanId,
          day_of_week: day.dayOfWeek,
          name: this.getDayName(day.dayOfWeek, workoutPlan.schedule),
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

      const { error: exerciseError } = await this.supabase
        .from('workout_exercises')
        .insert(exerciseInserts);

      if (exerciseError) {
        throw new Error(`Failed to save workout exercises: ${exerciseError.message}`);
      }
    }

    return workoutPlanId;
  }

  /**
   * Determine the appropriate workout split based on frequency
   */
  private determineWorkoutSplit(workoutFrequency: number): WorkoutSplit {
    if (workoutFrequency <= 3) {
      return {
        type: 'full-body',
        days: [
          { name: 'Full Body A', muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms'], dayOfWeek: 1 },
          { name: 'Full Body B', muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms'], dayOfWeek: 3 },
          { name: 'Full Body C', muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms'], dayOfWeek: 5 },
        ].slice(0, workoutFrequency),
      };
    } else if (workoutFrequency === 4) {
      return {
        type: 'upper-lower',
        days: [
          { name: 'Upper Body A', muscleGroups: ['chest', 'back', 'shoulders', 'arms'], dayOfWeek: 1 },
          { name: 'Lower Body A', muscleGroups: ['legs', 'glutes'], dayOfWeek: 2 },
          { name: 'Upper Body B', muscleGroups: ['chest', 'back', 'shoulders', 'arms'], dayOfWeek: 4 },
          { name: 'Lower Body B', muscleGroups: ['legs', 'glutes'], dayOfWeek: 5 },
        ],
      };
    } else {
      return {
        type: 'push-pull-legs',
        days: [
          { name: 'Push Day', muscleGroups: ['chest', 'shoulders', 'triceps'], dayOfWeek: 1 },
          { name: 'Pull Day', muscleGroups: ['back', 'biceps'], dayOfWeek: 2 },
          { name: 'Leg Day', muscleGroups: ['legs', 'glutes'], dayOfWeek: 3 },
          { name: 'Push Day', muscleGroups: ['chest', 'shoulders', 'triceps'], dayOfWeek: 5 },
          { name: 'Pull Day', muscleGroups: ['back', 'biceps'], dayOfWeek: 6 },
          { name: 'Leg Day', muscleGroups: ['legs', 'glutes'], dayOfWeek: 0 },
        ].slice(0, workoutFrequency),
      };
    }
  }

  /**
   * Get available exercises based on equipment, goal, and difficulty
   */
  private async getAvailableExercises(
    equipment: string[],
    goal: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Exercise[]> {
    return await exerciseService.getExercisesForGoal(
      goal as 'bulking' | 'cutting' | 'maintain',
      difficulty,
      equipment
    );
  }

  /**
   * Generate workout days with exercises
   */
  private async generateWorkoutDays(
    workoutSplit: WorkoutSplit,
    availableExercises: Exercise[],
    userProfile: UserProfile
  ): Promise<WorkoutDay[]> {
    const workoutDays: WorkoutDay[] = [];

    for (const splitDay of workoutSplit.days) {
      // Filter exercises for this day's muscle groups
      const dayExercises = availableExercises.filter(exercise =>
        exercise.muscleGroups.some(group =>
          splitDay.muscleGroups.some(targetGroup =>
            group.toLowerCase().includes(targetGroup.toLowerCase()) ||
            targetGroup.toLowerCase().includes(group.toLowerCase())
          )
        )
      );

      // Select exercises for this day
      const selectedExercises = this.selectExercisesForDay(
        dayExercises,
        splitDay.muscleGroups,
        userProfile.goal
      );

      // Create workout exercises with sets, reps, and rest periods
      const workoutExercises = selectedExercises.map(exercise =>
        this.createWorkoutExercise(exercise, userProfile.goal, userProfile)
      );

      // Calculate estimated duration
      const estimatedDuration = this.calculateEstimatedDuration(workoutExercises);

      workoutDays.push({
        dayOfWeek: splitDay.dayOfWeek,
        exercises: workoutExercises,
        estimatedDuration,
      });
    }

    return workoutDays;
  }

  /**
   * Select appropriate exercises for a workout day
   */
  private selectExercisesForDay(
    availableExercises: Exercise[],
    targetMuscleGroups: string[],
    goal: string
  ): Exercise[] {
    const selectedExercises: Exercise[] = [];
    const exercisesPerMuscleGroup = goal === 'cutting' ? 2 : 3; // Less volume for cutting

    // Group exercises by primary muscle group
    const exercisesByMuscleGroup = new Map<string, Exercise[]>();
    
    for (const exercise of availableExercises) {
      for (const muscleGroup of exercise.muscleGroups) {
        const normalizedGroup = muscleGroup.toLowerCase();
        if (!exercisesByMuscleGroup.has(normalizedGroup)) {
          exercisesByMuscleGroup.set(normalizedGroup, []);
        }
        exercisesByMuscleGroup.get(normalizedGroup)!.push(exercise);
      }
    }

    // Select exercises for each target muscle group
    for (const targetGroup of targetMuscleGroups) {
      const normalizedTarget = targetGroup.toLowerCase();
      const groupExercises = exercisesByMuscleGroup.get(normalizedTarget) || [];
      
      // Prioritize compound movements for strength goals
      const sortedExercises = groupExercises.sort((a, b) => {
        const aIsCompound = a.muscleGroups.length > 1;
        const bIsCompound = b.muscleGroups.length > 1;
        
        if (aIsCompound && !bIsCompound) return -1;
        if (!aIsCompound && bIsCompound) return 1;
        return 0;
      });

      // Select top exercises for this muscle group
      const selectedForGroup = sortedExercises
        .slice(0, exercisesPerMuscleGroup)
        .filter(exercise => !selectedExercises.some(selected => selected.id === exercise.id));

      selectedExercises.push(...selectedForGroup);
    }

    // Limit total exercises per workout
    const maxExercises = goal === 'cutting' ? 6 : 8;
    return selectedExercises.slice(0, maxExercises);
  }

  /**
   * Create a workout exercise with appropriate sets, reps, and rest
   */
  private createWorkoutExercise(exercise: Exercise, goal: string, userProfile: UserProfile): WorkoutExercise {
    let sets: number;
    let reps: string;
    let restPeriod: number;

    // Adjust based on goal and exercise type
    if (exercise.category === 'strength') {
      switch (goal) {
        case 'bulking':
          sets = exercise.muscleGroups.length > 1 ? 4 : 3; // More sets for compound
          reps = exercise.muscleGroups.length > 1 ? '6-8' : '8-12';
          restPeriod = 180; // 3 minutes
          break;
        case 'cutting':
          sets = 3;
          reps = '12-15';
          restPeriod = 90; // 1.5 minutes
          break;
        default: // maintain
          sets = 3;
          reps = '8-12';
          restPeriod = 120; // 2 minutes
          break;
      }
    } else if (exercise.category === 'cardio') {
      sets = 1;
      reps = '20-30 minutes';
      restPeriod = 60;
    } else {
      // flexibility
      sets = 2;
      reps = '30-60 seconds';
      restPeriod = 30;
    }

    return {
      exerciseId: exercise.id,
      sets,
      reps,
      restPeriod,
      notes: this.generateExerciseNotes(exercise, goal, userProfile),
    };
  }

  /**
   * Generate helpful notes for an exercise
   */
  private generateExerciseNotes(exercise: Exercise, goal: string, userProfile: UserProfile): string {
    const notes: string[] = [];

    if (goal === 'bulking' && exercise.muscleGroups.length > 1) {
      notes.push('Focus on progressive overload - increase weight when you can complete all sets');
    }

    if (goal === 'cutting') {
      notes.push('Keep rest periods short to maintain intensity');
    }

    if (exercise.difficulty === 'beginner' && exercise.modifications?.beginner) {
      notes.push(`Beginner tip: ${exercise.modifications.beginner[0]}`);
    }

    if (exercise.formTips.length > 0) {
      notes.push(`Form tip: ${exercise.formTips[0]}`);
    }

    // Climate-aware hints (assume PH default: hot). Language-aware.
    const lang = userProfile.language ?? 'en';
    const isOutdoorCardio =
      exercise.category === 'cardio' && /run|jog|walk|cycle|bike|sprint|jumps?/i.test(exercise.name);

    if (isOutdoorCardio) {
      notes.push(
        lang === 'fil'
          ? 'Sa mainit na panahon, mag-cardio nang mas maaga o mas late at uminom ng sapat na tubig'
          : 'In hot weather, schedule cardio earlier or later and hydrate well'
      );
    } else if (exercise.category === 'strength') {
      notes.push(
        lang === 'fil'
          ? 'Dagdagan ang tubig sa pagitan ng sets lalo na kapag mainit ang panahon'
          : 'Increase water intake between sets, especially in hot weather'
      );
    }

    return notes.join('. ');
  }

  /**
   * Calculate estimated workout duration
   */
  private calculateEstimatedDuration(exercises: WorkoutExercise[]): number {
    let totalMinutes = 0;

    for (const exercise of exercises) {
      // Estimate time per set (including rest)
      const timePerSet = 1.5; // 1.5 minutes per set on average
      const totalSets = exercise.sets;
      const restTimeMinutes = (exercise.restPeriod * (totalSets - 1)) / 60;
      
      totalMinutes += (totalSets * timePerSet) + restTimeMinutes;
    }

    // Add warm-up and cool-down time
    totalMinutes += 10;

    return Math.round(totalMinutes);
  }

  /**
   * Determine user difficulty level based on profile
   */
  private getUserDifficulty(userProfile: UserProfile): 'beginner' | 'intermediate' | 'advanced' {
    // Simple logic based on activity level and body composition
    if (userProfile.activityLevel === 'sedentary' || 
        userProfile.bodyComposition === 'skinny' || 
        userProfile.bodyComposition === 'obese') {
      return 'beginner';
    } else if (userProfile.activityLevel === 'very-active' && 
               userProfile.bodyComposition === 'average') {
      return 'advanced';
    } else {
      return 'intermediate';
    }
  }

  /**
   * Generate a descriptive plan name
   */
  private generatePlanName(goal: string, splitType: string): string {
    const goalNames = {
      bulking: 'Muscle Building',
      cutting: 'Fat Loss',
      maintain: 'Maintenance',
    };

    const splitNames = {
      'full-body': 'Full Body',
      'upper-lower': 'Upper/Lower Split',
      'push-pull-legs': 'Push/Pull/Legs',
      'bro-split': 'Body Part Split',
    };

    return `${goalNames[goal as keyof typeof goalNames]} - ${splitNames[splitType as keyof typeof splitNames]}`;
  }

  /**
   * Get day name for display
   */
  private getDayName(dayOfWeek: number, schedule: WorkoutDay[]): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Find if there are multiple workouts on different days with same muscle groups
    const sameTypeWorkouts = schedule.filter(day => day.dayOfWeek !== dayOfWeek);
    
    if (sameTypeWorkouts.length > 0) {
      const workoutIndex = schedule.findIndex(day => day.dayOfWeek === dayOfWeek);
      return `${dayNames[dayOfWeek]} Workout ${String.fromCharCode(65 + workoutIndex)}`; // A, B, C, etc.
    }
    
    return dayNames[dayOfWeek];
  }

  /**
   * Get user's active workout plan
   */
  async getUserActiveWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
    const { data, error } = await this.supabase
      .from('workout_plans')
      .select(`
        *,
        workout_days (
          *,
          workout_exercises (
            *,
            exercises (*)
          )
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No active plan found
      }
      throw new Error(`Failed to get active workout plan: ${error.message}`);
    }

    return this.mapDatabaseToWorkoutPlan(data);
  }

  /**
   * Map database result to WorkoutPlan interface
   */
  private mapDatabaseToWorkoutPlan(data: any): WorkoutPlan {
    const schedule: WorkoutDay[] = data.workout_days.map((day: any) => ({
      dayOfWeek: day.day_of_week,
      estimatedDuration: day.estimated_duration,
      exercises: day.workout_exercises.map((we: any) => ({
        exerciseId: we.exercise_id,
        sets: we.sets,
        reps: we.reps,
        weight: we.weight,
        restPeriod: we.rest_period,
        notes: we.notes,
      })),
    }));

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      schedule,
      duration: data.duration_weeks,
      goal: data.goal,
    };
  }
}

export const workoutPlanGenerator = new WorkoutPlanGenerator();