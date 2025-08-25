// Core user and fitness types
export interface OnboardingData {
  personalInfo: {
    age: number;
    gender: 'male' | 'female';
    height: { value: number; unit: 'cm' | 'ft-in' };
    weight: { value: number; unit: 'kg' | 'lbs' };
  };
  fitnessProfile: {
    bodyComposition: 'skinny' | 'skinny-fat' | 'average' | 'overweight' | 'obese';
    goal: 'bulking' | 'cutting' | 'maintain';
    activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';
    workoutFrequency: number; // 1-7 days per week
    availableEquipment: string[]; // ['home', 'dumbbells', 'barbells', 'machines', etc.]
  };
}

export interface TDEECalculation {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number; // Adjusted for goal
  macros: {
    protein: { grams: number; calories: number };
    carbs: { grams: number; calories: number };
    fats: { grams: number; calories: number };
  };
}

export interface Exercise {
  id: string;
  name: string;
  nameFilipino?: string;
  category: 'strength' | 'cardio' | 'flexibility';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  description?: string;
  benefits?: string[];
  safetyNotes?: string[];
  modifications?: {
    beginner?: string[];
    advanced?: string[];
  };
  progressionPath?: string[]; // IDs of exercises that progress from this one
  alternativeExercises?: string[]; // IDs of alternative exercises
  caloriesPerMinute?: number;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  schedule: WorkoutDay[];
  duration: number; // weeks
  goal: string;
}

export interface WorkoutDay {
  dayOfWeek: number;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // minutes
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number | string; // "8-12" for ranges
  weight?: number;
  restPeriod: number; // seconds
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId: string;
  date: Date;
  exercises: CompletedExercise[];
  duration: number; // actual workout time in minutes
  difficulty: 'too-easy' | 'just-right' | 'too-hard';
  notes?: string;
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
}

export interface CompletedSet {
  reps: number;
  weight?: number;
  completed: boolean;
  restTime?: number; // actual rest time taken
}

export interface MealPlan {
  id: string;
  userId: string;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  totalMacros: MacroBreakdown;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'merienda' | 'dinner';
  foods: FoodItem[];
  calories: number;
  macros: MacroBreakdown;
}

export interface FoodItem {
  id: string;
  name: string;
  nameFilipino?: string;
  category: string;
  servingSize: string;
  calories: number;
  macros: MacroBreakdown;
  commonInPhilippines: boolean;
  estimatedCost?: number; // in PHP
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fats: number;
}

export interface UserProfile {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female';
  heightValue: number;
  heightUnit: 'cm' | 'ft-in';
  weightValue: number;
  weightUnit: 'kg' | 'lbs';
  bodyComposition: 'skinny' | 'skinny-fat' | 'average' | 'overweight' | 'obese';
  goal: 'bulking' | 'cutting' | 'maintain';
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';
  workoutFrequency: number;
  availableEquipment: string[];
  bmr?: number;
  tdee?: number;
  targetCalories?: number;
  proteinGrams?: number;
  proteinCalories?: number;
  carbsGrams?: number;
  carbsCalories?: number;
  fatsGrams?: number;
  fatsCalories?: number;
  language: 'en' | 'fil';
  units: 'metric' | 'imperial';
  notifications: boolean;
  // Cultural context
  workSchedule?: 'day' | 'night' | 'flex';
  climate?: 'hot' | 'rainy' | 'cool';
  createdAt: Date;
  updatedAt: Date;
}