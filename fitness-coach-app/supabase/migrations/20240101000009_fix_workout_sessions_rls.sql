-- Fix workout sessions RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can insert their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can update their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can delete their own workout sessions" ON workout_sessions;

-- Recreate workout sessions RLS policies with explicit checks
CREATE POLICY "Users can view their own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Also fix completed_exercises and completed_sets policies
DROP POLICY IF EXISTS "Users can view completed exercises for their sessions" ON completed_exercises;
DROP POLICY IF EXISTS "Users can insert completed exercises for their sessions" ON completed_exercises;
DROP POLICY IF EXISTS "Users can update completed exercises for their sessions" ON completed_exercises;
DROP POLICY IF EXISTS "Users can delete completed exercises for their sessions" ON completed_exercises;

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
  ) WITH CHECK (
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

-- Fix completed_sets policies
DROP POLICY IF EXISTS "Users can view completed sets for their exercises" ON completed_sets;
DROP POLICY IF EXISTS "Users can insert completed sets for their exercises" ON completed_sets;
DROP POLICY IF EXISTS "Users can update completed sets for their exercises" ON completed_sets;
DROP POLICY IF EXISTS "Users can delete completed sets for their exercises" ON completed_sets;

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
  ) WITH CHECK (
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