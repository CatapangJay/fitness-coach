-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  height_value DECIMAL,
  height_unit TEXT CHECK (height_unit IN ('cm', 'ft-in')),
  weight_value DECIMAL,
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  body_composition TEXT CHECK (body_composition IN ('skinny', 'skinny-fat', 'average', 'overweight', 'obese')),
  goal TEXT CHECK (goal IN ('bulking', 'cutting', 'maintain')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active')),
  workout_frequency INTEGER CHECK (workout_frequency BETWEEN 1 AND 7),
  available_equipment TEXT[], -- array of equipment types
  bmr DECIMAL,
  tdee DECIMAL,
  target_calories DECIMAL,
  protein_grams DECIMAL,
  protein_calories DECIMAL,
  carbs_grams DECIMAL,
  carbs_calories DECIMAL,
  fats_grams DECIMAL,
  fats_calories DECIMAL,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'fil')),
  units TEXT DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_filipino TEXT,
  category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility')),
  muscle_groups TEXT[], -- array of muscle group names
  equipment TEXT[], -- array of required equipment
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT[],
  form_tips TEXT[],
  common_mistakes TEXT[],
  video_url TEXT,
  image_urls TEXT[],
  alternatives UUID[], -- array of exercise IDs
  progression_path UUID[], -- array of exercise IDs (easier to harder)
  is_popular_in_ph BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create filipino_foods table
CREATE TABLE filipino_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_filipino TEXT,
  category TEXT, -- 'protein', 'carbs', 'vegetables', 'fruits', etc.
  serving_size TEXT,
  calories DECIMAL,
  protein DECIMAL,
  carbs DECIMAL,
  fats DECIMAL,
  fiber DECIMAL,
  sodium DECIMAL,
  common_in_ph BOOLEAN DEFAULT true,
  regions TEXT[], -- where it's commonly found
  season TEXT, -- if seasonal
  estimated_cost DECIMAL, -- average cost in PHP
  cooking_methods TEXT[],
  meal_types TEXT[], -- breakfast, lunch, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_plans table
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT CHECK (goal IN ('bulking', 'cutting', 'maintain')),
  duration_weeks INTEGER,
  equipment TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_days table
CREATE TABLE workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  name TEXT, -- e.g., "Upper Body", "Push Day"
  estimated_duration INTEGER, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises table (junction table for workout_days and exercises)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_day_id UUID REFERENCES workout_days(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps TEXT, -- can be "8-12" for ranges or "10" for fixed
  weight DECIMAL,
  rest_period INTEGER, -- seconds
  order_index INTEGER, -- order in the workout
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_sessions table (actual workout tracking)
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  workout_day_id UUID REFERENCES workout_days(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- actual workout time in minutes
  difficulty TEXT CHECK (difficulty IN ('too-easy', 'just-right', 'too-hard')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create completed_exercises table (exercises completed in a session)
CREATE TABLE completed_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create completed_sets table (sets completed for each exercise)
CREATE TABLE completed_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_exercise_id UUID REFERENCES completed_exercises(id) ON DELETE CASCADE,
  set_number INTEGER,
  reps INTEGER,
  weight DECIMAL,
  rest_time INTEGER, -- actual rest time taken in seconds
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  total_calories DECIMAL,
  total_protein DECIMAL,
  total_carbs DECIMAL,
  total_fats DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create meals table
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'merienda', 'dinner')),
  calories DECIMAL,
  protein DECIMAL,
  carbs DECIMAL,
  fats DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_foods table (junction table for meals and foods)
CREATE TABLE meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  food_id UUID REFERENCES filipino_foods(id) ON DELETE CASCADE,
  quantity DECIMAL,
  unit TEXT, -- serving size unit
  calories DECIMAL,
  protein DECIMAL,
  carbs DECIMAL,
  fats DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);