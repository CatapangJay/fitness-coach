-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE filipino_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;

-- User Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Exercises RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view exercises" ON exercises
  FOR SELECT USING (true);

-- Filipino Foods RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view filipino foods" ON filipino_foods
  FOR SELECT USING (true);

-- Workout Plans RLS Policies
CREATE POLICY "Users can view their own workout plans" ON workout_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans" ON workout_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans" ON workout_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans" ON workout_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Workout Days RLS Policies
CREATE POLICY "Users can view workout days for their plans" ON workout_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_plans 
      WHERE workout_plans.id = workout_days.workout_plan_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workout days for their plans" ON workout_days
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_plans 
      WHERE workout_plans.id = workout_days.workout_plan_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workout days for their plans" ON workout_days
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_plans 
      WHERE workout_plans.id = workout_days.workout_plan_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete workout days for their plans" ON workout_days
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_plans 
      WHERE workout_plans.id = workout_days.workout_plan_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

-- Workout Exercises RLS Policies
CREATE POLICY "Users can view workout exercises for their plans" ON workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workout_plans ON workout_plans.id = workout_days.workout_plan_id
      WHERE workout_days.id = workout_exercises.workout_day_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workout exercises for their plans" ON workout_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workout_plans ON workout_plans.id = workout_days.workout_plan_id
      WHERE workout_days.id = workout_exercises.workout_day_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workout exercises for their plans" ON workout_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workout_plans ON workout_plans.id = workout_days.workout_plan_id
      WHERE workout_days.id = workout_exercises.workout_day_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete workout exercises for their plans" ON workout_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workout_plans ON workout_plans.id = workout_days.workout_plan_id
      WHERE workout_days.id = workout_exercises.workout_day_id 
      AND workout_plans.user_id = auth.uid()
    )
  );

-- Workout Sessions RLS Policies
CREATE POLICY "Users can view their own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Completed Exercises RLS Policies
CREATE POLICY "Users can view completed exercises for their sessions" ON completed_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = completed_exercises.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert completed exercises for their sessions" ON completed_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = completed_exercises.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update completed exercises for their sessions" ON completed_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = completed_exercises.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete completed exercises for their sessions" ON completed_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = completed_exercises.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Completed Sets RLS Policies
CREATE POLICY "Users can view completed sets for their exercises" ON completed_sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM completed_exercises 
      JOIN workout_sessions ON workout_sessions.id = completed_exercises.workout_session_id
      WHERE completed_exercises.id = completed_sets.completed_exercise_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert completed sets for their exercises" ON completed_sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM completed_exercises 
      JOIN workout_sessions ON workout_sessions.id = completed_exercises.workout_session_id
      WHERE completed_exercises.id = completed_sets.completed_exercise_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update completed sets for their exercises" ON completed_sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM completed_exercises 
      JOIN workout_sessions ON workout_sessions.id = completed_exercises.workout_session_id
      WHERE completed_exercises.id = completed_sets.completed_exercise_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete completed sets for their exercises" ON completed_sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM completed_exercises 
      JOIN workout_sessions ON workout_sessions.id = completed_exercises.workout_session_id
      WHERE completed_exercises.id = completed_sets.completed_exercise_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Meal Plans RLS Policies
CREATE POLICY "Users can view their own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" ON meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans" ON meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Meals RLS Policies
CREATE POLICY "Users can view meals for their meal plans" ON meals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meals.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert meals for their meal plans" ON meals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meals.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update meals for their meal plans" ON meals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meals.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete meals for their meal plans" ON meals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meals.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

-- Meal Foods RLS Policies
CREATE POLICY "Users can view meal foods for their meals" ON meal_foods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meals 
      JOIN meal_plans ON meal_plans.id = meals.meal_plan_id
      WHERE meals.id = meal_foods.meal_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert meal foods for their meals" ON meal_foods
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals 
      JOIN meal_plans ON meal_plans.id = meals.meal_plan_id
      WHERE meals.id = meal_foods.meal_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update meal foods for their meals" ON meal_foods
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM meals 
      JOIN meal_plans ON meal_plans.id = meals.meal_plan_id
      WHERE meals.id = meal_foods.meal_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete meal foods for their meals" ON meal_foods
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM meals 
      JOIN meal_plans ON meal_plans.id = meals.meal_plan_id
      WHERE meals.id = meal_foods.meal_id 
      AND meal_plans.user_id = auth.uid()
    )
  );