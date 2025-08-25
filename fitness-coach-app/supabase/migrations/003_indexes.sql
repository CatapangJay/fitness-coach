-- Indexes for user_profiles table
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_goal ON user_profiles(goal);
CREATE INDEX idx_user_profiles_activity_level ON user_profiles(activity_level);

-- Indexes for exercises table
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_popular_ph ON exercises(is_popular_in_ph);
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_name_filipino ON exercises(name_filipino);

-- Indexes for filipino_foods table
CREATE INDEX idx_filipino_foods_category ON filipino_foods(category);
CREATE INDEX idx_filipino_foods_common_ph ON filipino_foods(common_in_ph);
CREATE INDEX idx_filipino_foods_name ON filipino_foods(name);
CREATE INDEX idx_filipino_foods_name_filipino ON filipino_foods(name_filipino);
CREATE INDEX idx_filipino_foods_meal_types ON filipino_foods USING GIN(meal_types);
CREATE INDEX idx_filipino_foods_regions ON filipino_foods USING GIN(regions);
CREATE INDEX idx_filipino_foods_calories ON filipino_foods(calories);

-- Indexes for workout_plans table
CREATE INDEX idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX idx_workout_plans_goal ON workout_plans(goal);
CREATE INDEX idx_workout_plans_is_active ON workout_plans(is_active);
CREATE INDEX idx_workout_plans_equipment ON workout_plans USING GIN(equipment);

-- Indexes for workout_days table
CREATE INDEX idx_workout_days_plan_id ON workout_days(workout_plan_id);
CREATE INDEX idx_workout_days_day_of_week ON workout_days(day_of_week);

-- Indexes for workout_exercises table
CREATE INDEX idx_workout_exercises_day_id ON workout_exercises(workout_day_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_order ON workout_exercises(order_index);

-- Indexes for workout_sessions table
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(date);
CREATE INDEX idx_workout_sessions_plan_id ON workout_sessions(workout_plan_id);
CREATE INDEX idx_workout_sessions_day_id ON workout_sessions(workout_day_id);
CREATE INDEX idx_workout_sessions_start_time ON workout_sessions(start_time);

-- Indexes for completed_exercises table
CREATE INDEX idx_completed_exercises_session_id ON completed_exercises(workout_session_id);
CREATE INDEX idx_completed_exercises_exercise_id ON completed_exercises(exercise_id);
CREATE INDEX idx_completed_exercises_order ON completed_exercises(order_index);

-- Indexes for completed_sets table
CREATE INDEX idx_completed_sets_exercise_id ON completed_sets(completed_exercise_id);
CREATE INDEX idx_completed_sets_set_number ON completed_sets(set_number);
CREATE INDEX idx_completed_sets_completed ON completed_sets(completed);

-- Indexes for meal_plans table
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_date ON meal_plans(date);
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, date);

-- Indexes for meals table
CREATE INDEX idx_meals_plan_id ON meals(meal_plan_id);
CREATE INDEX idx_meals_type ON meals(meal_type);

-- Indexes for meal_foods table
CREATE INDEX idx_meal_foods_meal_id ON meal_foods(meal_id);
CREATE INDEX idx_meal_foods_food_id ON meal_foods(food_id);

-- Composite indexes for common queries
CREATE INDEX idx_user_profiles_goal_activity ON user_profiles(goal, activity_level);
CREATE INDEX idx_exercises_category_difficulty ON exercises(category, difficulty);
CREATE INDEX idx_exercises_equipment_difficulty ON exercises USING GIN(equipment) WHERE difficulty = 'beginner';
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, date);
CREATE INDEX idx_filipino_foods_category_common ON filipino_foods(category, common_in_ph);