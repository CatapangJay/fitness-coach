import { supabase } from '@/lib/supabase';

export interface ProgressData {
  exerciseId: string;
  exerciseName: string;
  exerciseNameFilipino?: string;
  sessions: {
    date: string;
    sets: {
      reps: number;
      weight?: number;
      volume?: number; // reps * weight
    }[];
    bestSet?: {
      reps: number;
      weight?: number;
      volume?: number;
    };
    totalVolume: number;
    averageReps: number;
    maxWeight?: number;
  }[];
  progressMetrics: {
    totalSessions: number;
    totalVolume: number;
    averageVolume: number;
    bestVolume: number;
    volumeImprovement: number; // percentage
    strengthImprovement: number; // percentage
    consistencyScore: number; // 0-100
    lastWorkout: string;
    trend: 'improving' | 'maintaining' | 'declining';
  };
}

export interface WorkoutSummary {
  totalWorkouts: number;
  totalDuration: number; // minutes
  averageDuration: number;
  totalVolume: number;
  averageVolume: number;
  workoutFrequency: number; // workouts per week
  currentStreak: number; // consecutive workout days
  longestStreak: number;
  lastWorkout: string;
  favoriteExercises: {
    exerciseId: string;
    exerciseName: string;
    frequency: number;
  }[];
}

export async function getProgressData(userId: string, exerciseId?: string, days = 90): Promise<ProgressData[]> {
  try {
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let query = supabase
      .from('workout_sessions')
      .select(`
        id,
        date,
        completed_exercises(
          exercise_id,
          exercises(id, name, name_filipino),
          completed_sets(
            reps,
            weight,
            completed
          )
        )
      `)
      .eq('user_id', userId)
      .not('end_time', 'is', null)
      .gte('date', cutoffDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const { data: sessions, error } = await query;

    if (error) {
      throw new Error(`Failed to get progress data: ${error.message}`);
    }

    // Group data by exercise
    const exerciseMap = new Map<string, any>();

    sessions?.forEach(session => {
      session.completed_exercises?.forEach((completedExercise: any) => {
        const exId = completedExercise.exercise_id;
        const exercise = completedExercise.exercises;
        
        // Filter by specific exercise if requested
        if (exerciseId && exId !== exerciseId) return;

        if (!exerciseMap.has(exId)) {
          exerciseMap.set(exId, {
            exerciseId: exId,
            exerciseName: exercise.name,
            exerciseNameFilipino: exercise.name_filipino,
            sessions: []
          });
        }

        const exerciseData = exerciseMap.get(exId);
        
        // Process sets for this session
        const completedSets = completedExercise.completed_sets
          ?.filter((set: any) => set.completed)
          ?.map((set: any) => ({
            reps: set.reps,
            weight: set.weight,
            volume: set.weight ? set.reps * set.weight : set.reps
          })) || [];

        if (completedSets.length > 0) {
          const totalVolume = completedSets.reduce((sum: number, set: any) => sum + (set.volume || 0), 0);
          const averageReps = completedSets.reduce((sum: number, set: any) => sum + set.reps, 0) / completedSets.length;
          const maxWeight = Math.max(...completedSets.map((set: any) => set.weight || 0));
          const bestSet = completedSets.reduce((best: any, current: any) => 
            (current.volume || 0) > (best.volume || 0) ? current : best
          );

          exerciseData.sessions.push({
            date: session.date,
            sets: completedSets,
            bestSet,
            totalVolume,
            averageReps,
            maxWeight: maxWeight > 0 ? maxWeight : undefined
          });
        }
      });
    });

    // Calculate progress metrics for each exercise
    const progressData: ProgressData[] = Array.from(exerciseMap.values()).map(exercise => {
      const sessions = exercise.sessions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      if (sessions.length === 0) {
        return {
          ...exercise,
          progressMetrics: {
            totalSessions: 0,
            totalVolume: 0,
            averageVolume: 0,
            bestVolume: 0,
            volumeImprovement: 0,
            strengthImprovement: 0,
            consistencyScore: 0,
            lastWorkout: '',
            trend: 'maintaining' as const
          }
        };
      }

      const totalSessions = sessions.length;
      const totalVolume = sessions.reduce((sum: number, s: any) => sum + s.totalVolume, 0);
      const averageVolume = totalVolume / totalSessions;
      const bestVolume = Math.max(...sessions.map((s: any) => s.totalVolume));
      
      // Calculate improvements (compare first 25% vs last 25% of sessions)
      const firstQuarter = sessions.slice(0, Math.max(1, Math.floor(sessions.length * 0.25)));
      const lastQuarter = sessions.slice(-Math.max(1, Math.floor(sessions.length * 0.25)));
      
      const firstQuarterAvgVolume = firstQuarter.reduce((sum: number, s: any) => sum + s.totalVolume, 0) / firstQuarter.length;
      const lastQuarterAvgVolume = lastQuarter.reduce((sum: number, s: any) => sum + s.totalVolume, 0) / lastQuarter.length;
      
      const volumeImprovement = firstQuarterAvgVolume > 0 
        ? ((lastQuarterAvgVolume - firstQuarterAvgVolume) / firstQuarterAvgVolume) * 100 
        : 0;

      const firstQuarterMaxWeight = Math.max(...firstQuarter.flatMap((s: any) => s.sets.map((set: any) => set.weight || 0)));
      const lastQuarterMaxWeight = Math.max(...lastQuarter.flatMap((s: any) => s.sets.map((set: any) => set.weight || 0)));
      
      const strengthImprovement = firstQuarterMaxWeight > 0 
        ? ((lastQuarterMaxWeight - firstQuarterMaxWeight) / firstQuarterMaxWeight) * 100 
        : 0;

      // Calculate consistency score based on workout frequency
      const daysBetweenSessions = [];
      for (let i = 1; i < sessions.length; i++) {
        const daysDiff = (new Date(sessions[i].date).getTime() - new Date(sessions[i-1].date).getTime()) / (1000 * 60 * 60 * 24);
        daysBetweenSessions.push(daysDiff);
      }
      
      const averageDaysBetween = daysBetweenSessions.length > 0 
        ? daysBetweenSessions.reduce((sum, days) => sum + days, 0) / daysBetweenSessions.length 
        : 0;
      
      // Consistency score: higher score for more frequent, regular workouts
      const consistencyScore = Math.max(0, Math.min(100, 100 - (averageDaysBetween - 3) * 10));

      // Determine trend
      let trend: 'improving' | 'maintaining' | 'declining' = 'maintaining';
      if (volumeImprovement > 5) trend = 'improving';
      else if (volumeImprovement < -5) trend = 'declining';

      return {
        ...exercise,
        sessions,
        progressMetrics: {
          totalSessions,
          totalVolume,
          averageVolume,
          bestVolume,
          volumeImprovement,
          strengthImprovement,
          consistencyScore,
          lastWorkout: sessions[sessions.length - 1].date,
          trend
        }
      };
    });

    return progressData;
  } catch (error) {
    console.error('Failed to get progress data:', error);
    return [];
  }
}

export async function getWorkoutSummary(userId: string, days = 90): Promise<WorkoutSummary> {
  try {
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data: sessions, error } = await supabase
      .from('workout_sessions')
      .select(`
        id,
        date,
        duration,
        completed_exercises(
          exercise_id,
          exercises(name),
          completed_sets(
            reps,
            weight,
            completed
          )
        )
      `)
      .eq('user_id', userId)
      .not('end_time', 'is', null)
      .gte('date', cutoffDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Failed to get workout summary: ${error.message}`);
    }

    if (!sessions || sessions.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalVolume: 0,
        averageVolume: 0,
        workoutFrequency: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastWorkout: '',
        favoriteExercises: []
      };
    }

    const totalWorkouts = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageDuration = totalDuration / totalWorkouts;

    // Calculate total volume
    let totalVolume = 0;
    const exerciseFrequency = new Map<string, { name: string; count: number }>();

    sessions.forEach(session => {
      session.completed_exercises?.forEach((completedExercise: any) => {
        const exerciseName = completedExercise.exercises.name;
        const exerciseId = completedExercise.exercise_id;
        
        // Count exercise frequency
        if (!exerciseFrequency.has(exerciseId)) {
          exerciseFrequency.set(exerciseId, { name: exerciseName, count: 0 });
        }
        exerciseFrequency.get(exerciseId)!.count++;

        // Calculate volume
        completedExercise.completed_sets?.forEach((set: any) => {
          if (set.completed) {
            totalVolume += set.weight ? set.reps * set.weight : set.reps;
          }
        });
      });
    });

    const averageVolume = totalVolume / totalWorkouts;

    // Calculate workout frequency (workouts per week)
    const daySpan = (new Date(sessions[sessions.length - 1].date).getTime() - new Date(sessions[0].date).getTime()) / (1000 * 60 * 60 * 24);
    const workoutFrequency = daySpan > 0 ? (totalWorkouts / daySpan) * 7 : 0;

    // Calculate streaks
    const workoutDates = sessions.map(s => s.date).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Calculate current streak (from today backwards)
    const today = new Date();
    const lastWorkoutDate = new Date(workoutDates[workoutDates.length - 1]);
    const daysSinceLastWorkout = (today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastWorkout <= 2) { // Allow 1-2 days gap
      currentStreak = 1;
      for (let i = workoutDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(workoutDates[i + 1]);
        const prevDate = new Date(workoutDates[i]);
        const daysDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 2) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < workoutDates.length; i++) {
      const currentDate = new Date(workoutDates[i]);
      const prevDate = new Date(workoutDates[i - 1]);
      const daysDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 2) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Get favorite exercises (top 5 most frequent)
    const favoriteExercises = Array.from(exerciseFrequency.entries())
      .map(([exerciseId, data]) => ({
        exerciseId,
        exerciseName: data.name,
        frequency: data.count
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    return {
      totalWorkouts,
      totalDuration,
      averageDuration,
      totalVolume,
      averageVolume,
      workoutFrequency,
      currentStreak,
      longestStreak,
      lastWorkout: sessions[sessions.length - 1].date,
      favoriteExercises
    };
  } catch (error) {
    console.error('Failed to get workout summary:', error);
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      averageDuration: 0,
      totalVolume: 0,
      averageVolume: 0,
      workoutFrequency: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastWorkout: '',
      favoriteExercises: []
    };
  }
}

export async function getProgressiveOverloadDetection(userId: string, exerciseId: string, sessions = 10) {
  try {
    
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        date,
        completed_exercises!inner(
          exercise_id,
          completed_sets(
            reps,
            weight,
            completed
          )
        )
      `)
      .eq('user_id', userId)
      .eq('completed_exercises.exercise_id', exerciseId)
      .not('end_time', 'is', null)
      .order('date', { ascending: false })
      .limit(sessions);

    if (error) {
      throw new Error(`Failed to get progressive overload data: ${error.message}`);
    }

    const sessionData = data?.map(session => {
      const completedSets = session.completed_exercises[0]?.completed_sets
        ?.filter(set => set.completed)
        ?.map(set => ({
          reps: set.reps,
          weight: set.weight || 0,
          volume: (set.weight || 0) * set.reps
        })) || [];

      const totalVolume = completedSets.reduce((sum, set) => sum + set.volume, 0);
      const maxWeight = Math.max(...completedSets.map(set => set.weight));
      const totalReps = completedSets.reduce((sum, set) => sum + set.reps, 0);

      return {
        date: session.date,
        totalVolume,
        maxWeight: maxWeight > 0 ? maxWeight : undefined,
        totalReps,
        sets: completedSets
      };
    }).reverse(); // Reverse to get chronological order

    // Analyze progressive overload
    const analysis = {
      isProgressing: false,
      stagnantSessions: 0,
      recommendations: [] as string[],
      trend: 'stable' as 'improving' | 'stable' | 'declining',
      nextSuggestion: ''
    };

    if (sessionData && sessionData.length >= 2) {
      const recent = sessionData.slice(-3); // Last 3 sessions
      const earlier = sessionData.slice(0, Math.max(1, sessionData.length - 3));

      const recentAvgVolume = recent.reduce((sum, s) => sum + s.totalVolume, 0) / recent.length;
      const earlierAvgVolume = earlier.reduce((sum, s) => sum + s.totalVolume, 0) / earlier.length;

      const volumeChange = ((recentAvgVolume - earlierAvgVolume) / earlierAvgVolume) * 100;

      if (volumeChange > 5) {
        analysis.isProgressing = true;
        analysis.trend = 'improving';
        analysis.recommendations.push('Great progress! Keep up the good work.');
      } else if (volumeChange < -5) {
        analysis.trend = 'declining';
        analysis.recommendations.push('Consider reducing intensity or taking a rest day.');
      } else {
        // Check for stagnation
        const lastSession = sessionData[sessionData.length - 1];
        const prevSession = sessionData[sessionData.length - 2];
        
        if (lastSession.totalVolume <= prevSession.totalVolume) {
          analysis.stagnantSessions++;
          analysis.recommendations.push('Try increasing weight, reps, or sets next time.');
          analysis.nextSuggestion = 'Progressive overload needed - increase intensity';
        }
      }
    }

    return {
      success: true,
      sessions: sessionData || [],
      analysis
    };
  } catch (error) {
    console.error('Failed to get progressive overload detection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze progressive overload',
      sessions: [],
      analysis: null
    };
  }
}