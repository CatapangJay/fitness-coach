import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side supabase instance
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Server-side supabase client factory
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Database types based on our schema
export interface UserProfile {
  id: string;
  user_id: string;
  age?: number;
  gender?: 'male' | 'female';
  height_value?: number;
  height_unit?: 'cm' | 'ft-in';
  weight_value?: number;
  weight_unit?: 'kg' | 'lbs';
  body_composition?: 'skinny' | 'skinny-fat' | 'average' | 'overweight' | 'obese';
  goal?: 'bulking' | 'cutting' | 'maintain';
  activity_level?: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';
  workout_frequency?: number;
  available_equipment?: string[];
  bmr?: number;
  tdee?: number;
  target_calories?: number;
  protein_grams?: number;
  protein_calories?: number;
  carbs_grams?: number;
  carbs_calories?: number;
  fats_grams?: number;
  fats_calories?: number;
  language?: 'en' | 'fil';
  units?: 'metric' | 'imperial';
  notifications?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Exercise {
  id: string;
  name: string;
  name_filipino?: string;
  category: 'strength' | 'cardio' | 'flexibility';
  muscle_groups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  form_tips: string[];
  common_mistakes: string[];
  video_url?: string;
  image_urls?: string[];
  alternatives?: string[];
  progression_path?: string[];
  is_popular_in_ph: boolean;
  created_at?: string;
}

export interface FilipinoFood {
  id: string;
  name: string;
  name_filipino?: string;
  category: string;
  serving_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodium?: number;
  common_in_ph: boolean;
  regions?: string[];
  season?: string;
  estimated_cost?: number;
  cooking_methods?: string[];
  meal_types?: string[];
  created_at?: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  goal: 'bulking' | 'cutting' | 'maintain';
  duration_weeks?: number;
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_plan_id?: string;
  workout_day_id?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  difficulty?: 'too-easy' | 'just-right' | 'too-hard';
  notes?: string;
  created_at?: string;
}

// Helper functions for common database operations
export const dbHelpers = {
  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  },

  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profile, { onConflict: 'user_id' })
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting user profile:', error);
      return null;
    }
    
    return data;
  },

  // Exercise operations
  async getExercises(filters?: {
    category?: string;
    equipment?: string[];
    difficulty?: string;
    popularInPh?: boolean;
  }): Promise<Exercise[]> {
    let query = supabase.from('exercises').select('*');
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.equipment && filters.equipment.length > 0) {
      query = query.overlaps('equipment', filters.equipment);
    }
    
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    
    if (filters?.popularInPh !== undefined) {
      query = query.eq('is_popular_in_ph', filters.popularInPh);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
    
    return data || [];
  },

  // Filipino Foods operations
  async getFilipinoFoods(filters?: {
    category?: string;
    mealTypes?: string[];
    commonInPh?: boolean;
    search?: string;
  }): Promise<FilipinoFood[]> {
    let query = supabase.from('filipino_foods').select('*');
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.mealTypes && filters.mealTypes.length > 0) {
      query = query.overlaps('meal_types', filters.mealTypes);
    }
    
    if (filters?.commonInPh !== undefined) {
      query = query.eq('common_in_ph', filters.commonInPh);
    }
    
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,name_filipino.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching Filipino foods:', error);
      return [];
    }
    
    return data || [];
  },

  // Workout Plan operations
  async getUserWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching workout plans:', error);
      return [];
    }
    
    return data || [];
  },

  async getActiveWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching active workout plan:', error);
      return null;
    }
    
    return data;
  },

  // Workout Session operations
  async getUserWorkoutSessions(userId: string, limit = 10): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching workout sessions:', error);
      return [];
    }
    
    return data || [];
  }
};