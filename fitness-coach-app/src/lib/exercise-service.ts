import { supabase } from '@/lib/supabase';
import { Exercise } from '@/types';

export interface ExerciseFilters {
  category?: 'strength' | 'cardio' | 'flexibility';
  muscleGroups?: string[];
  equipment?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  searchQuery?: string;
}

export interface ExerciseSearchResult {
  exercises: Exercise[];
  totalCount: number;
  hasMore: boolean;
}

export class ExerciseService {
  private supabase = supabase;

  /**
   * Search exercises with filters and pagination
   */
  async searchExercises(
    filters: ExerciseFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<ExerciseSearchResult> {
    let query = this.supabase
      .from('exercises')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters.muscleGroups && filters.muscleGroups.length > 0) {
      query = query.overlaps('muscle_groups', filters.muscleGroups);
    }

    if (filters.equipment && filters.equipment.length > 0) {
      query = query.overlaps('equipment', filters.equipment);
    }

    if (filters.searchQuery) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,name_filipino.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by name
    query = query.order('name');

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to search exercises: ${error.message}`);
    }

    const exercises: Exercise[] = (data || []).map(this.mapDatabaseToExercise);
    const totalCount = count || 0;
    const hasMore = from + exercises.length < totalCount;

    return {
      exercises,
      totalCount,
      hasMore,
    };
  }

  /**
   * Get exercise by ID
   */
  async getExerciseById(id: string): Promise<Exercise | null> {
    const { data, error } = await this.supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to get exercise: ${error.message}`);
    }

    return this.mapDatabaseToExercise(data);
  }

  /**
   * Get exercises by equipment availability
   */
  async getExercisesByEquipment(equipment: string[]): Promise<Exercise[]> {
    const { data, error } = await this.supabase
      .from('exercises')
      .select('*')
      .overlaps('equipment', equipment)
      .order('name');

    if (error) {
      throw new Error(`Failed to get exercises by equipment: ${error.message}`);
    }

    return (data || []).map(this.mapDatabaseToExercise);
  }

  /**
   * Get exercises by muscle groups
   */
  async getExercisesByMuscleGroups(muscleGroups: string[]): Promise<Exercise[]> {
    const { data, error } = await this.supabase
      .from('exercises')
      .select('*')
      .overlaps('muscle_groups', muscleGroups)
      .order('name');

    if (error) {
      throw new Error(`Failed to get exercises by muscle groups: ${error.message}`);
    }

    return (data || []).map(this.mapDatabaseToExercise);
  }

  /**
   * Get alternative exercises for a given exercise
   */
  async getAlternativeExercises(exerciseId: string): Promise<Exercise[]> {
    const exercise = await this.getExerciseById(exerciseId);
    if (!exercise || !exercise.alternativeExercises?.length) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('exercises')
      .select('*')
      .in('id', exercise.alternativeExercises);

    if (error) {
      throw new Error(`Failed to get alternative exercises: ${error.message}`);
    }

    return (data || []).map(this.mapDatabaseToExercise);
  }

  /**
   * Get progression path for an exercise
   */
  async getProgressionPath(exerciseId: string): Promise<Exercise[]> {
    const exercise = await this.getExerciseById(exerciseId);
    if (!exercise || !exercise.progressionPath?.length) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('exercises')
      .select('*')
      .in('id', exercise.progressionPath)
      .order('difficulty');

    if (error) {
      throw new Error(`Failed to get progression path: ${error.message}`);
    }

    return (data || []).map(this.mapDatabaseToExercise);
  }

  /**
   * Get exercises suitable for a specific goal and difficulty
   */
  async getExercisesForGoal(
    goal: 'bulking' | 'cutting' | 'maintain',
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    equipment: string[]
  ): Promise<Exercise[]> {
    let categoryFilter: string[] = [];

    switch (goal) {
      case 'bulking':
        categoryFilter = ['strength']; // Focus on strength training for muscle building
        break;
      case 'cutting':
        categoryFilter = ['strength', 'cardio']; // Mix of strength and cardio for fat loss
        break;
      case 'maintain':
        categoryFilter = ['strength', 'cardio', 'flexibility']; // Balanced approach
        break;
    }

    const { data, error } = await this.supabase
      .from('exercises')
      .select('*')
      .in('category', categoryFilter)
      .eq('difficulty', difficulty)
      .overlaps('equipment', equipment)
      .order('name');

    if (error) {
      throw new Error(`Failed to get exercises for goal: ${error.message}`);
    }

    return (data || []).map(this.mapDatabaseToExercise);
  }

  /**
   * Get all available muscle groups
   */
  async getMuscleGroups(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('exercises')
      .select('muscle_groups');

    if (error) {
      throw new Error(`Failed to get muscle groups: ${error.message}`);
    }

    const allMuscleGroups = new Set<string>();
    data?.forEach(exercise => {
      exercise.muscle_groups?.forEach((group: string) => {
        allMuscleGroups.add(group);
      });
    });

    return Array.from(allMuscleGroups).sort();
  }

  /**
   * Get all available equipment types
   */
  async getEquipmentTypes(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('exercises')
      .select('equipment');

    if (error) {
      throw new Error(`Failed to get equipment types: ${error.message}`);
    }

    const allEquipment = new Set<string>();
    data?.forEach(exercise => {
      exercise.equipment?.forEach((eq: string) => {
        allEquipment.add(eq);
      });
    });

    return Array.from(allEquipment).sort();
  }

  /**
   * Map database record to Exercise interface
   */
  private mapDatabaseToExercise(data: any): Exercise {
    return {
      id: data.id,
      name: data.name,
      nameFilipino: data.name_filipino,
      category: data.category,
      muscleGroups: data.muscle_groups || [],
      equipment: data.equipment || [],
      difficulty: data.difficulty,
      instructions: data.instructions || [],
      formTips: data.form_tips || [],
      commonMistakes: data.common_mistakes || [],
      description: data.description,
      benefits: data.benefits || [],
      safetyNotes: data.safety_notes || [],
      modifications: data.modifications,
      progressionPath: data.progression_path || [],
      alternativeExercises: data.alternative_exercises || [],
      caloriesPerMinute: data.calories_per_minute,
    };
  }
}

export const exerciseService = new ExerciseService();