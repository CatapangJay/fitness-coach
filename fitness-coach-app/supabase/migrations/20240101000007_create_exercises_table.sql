-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_filipino VARCHAR(255),
  category VARCHAR(50) NOT NULL CHECK (category IN ('strength', 'cardio', 'flexibility')),
  muscle_groups TEXT[] NOT NULL,
  equipment TEXT[] NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT[] NOT NULL,
  form_tips TEXT[] NOT NULL,
  common_mistakes TEXT[] NOT NULL,
  description TEXT,
  benefits TEXT[],
  safety_notes TEXT[],
  modifications JSONB, -- For beginner/advanced variations
  progression_path TEXT[], -- IDs of exercises that progress from this one
  alternative_exercises TEXT[], -- IDs of alternative exercises
  calories_per_minute DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment);
CREATE INDEX idx_exercises_name ON exercises(name);

-- Create full-text search index
CREATE INDEX idx_exercises_search ON exercises USING GIN(
  to_tsvector('english', name || ' ' || COALESCE(name_filipino, '') || ' ' || COALESCE(description, ''))
);

-- Insert sample Filipino-friendly exercises
INSERT INTO exercises (name, name_filipino, category, muscle_groups, equipment, difficulty, instructions, form_tips, common_mistakes, description, benefits, safety_notes, modifications) VALUES

-- Bodyweight exercises (common for home workouts)
('Push-ups', 'Push-up', 'strength', ARRAY['chest', 'shoulders', 'triceps', 'core'], ARRAY['bodyweight'], 'beginner', 
 ARRAY['Start in plank position with hands shoulder-width apart', 'Lower your body until chest nearly touches floor', 'Push back up to starting position', 'Keep your body in straight line throughout'],
 ARRAY['Keep core tight throughout movement', 'Don''t let hips sag or pike up', 'Full range of motion - chest to floor', 'Breathe out as you push up'],
 ARRAY['Sagging hips', 'Partial range of motion', 'Flaring elbows too wide', 'Holding breath'],
 'Classic upper body exercise that builds chest, shoulders, and arm strength',
 ARRAY['Builds upper body strength', 'Improves core stability', 'No equipment needed', 'Can be done anywhere'],
 ARRAY['Start slowly if you''re new to exercise', 'Stop if you feel sharp pain'],
 '{"beginner": ["Wall push-ups", "Knee push-ups"], "advanced": ["Diamond push-ups", "One-arm push-ups"]}'::jsonb),

('Squats', 'Squat', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings', 'calves'], ARRAY['bodyweight'], 'beginner',
 ARRAY['Stand with feet shoulder-width apart', 'Lower your body as if sitting back into a chair', 'Keep chest up and knees behind toes', 'Return to standing position'],
 ARRAY['Keep weight on your heels', 'Don''t let knees cave inward', 'Go as low as comfortable', 'Keep chest proud'],
 ARRAY['Knees caving inward', 'Leaning too far forward', 'Not going deep enough', 'Rising on toes'],
 'Fundamental lower body exercise that targets legs and glutes',
 ARRAY['Strengthens entire lower body', 'Improves functional movement', 'Burns many calories', 'Builds core strength'],
 ARRAY['Don''t force depth if you have knee issues', 'Keep movements controlled'],
 '{"beginner": ["Chair-assisted squats", "Partial squats"], "advanced": ["Jump squats", "Pistol squats"]}'::jsonb),

-- Dumbbell exercises
('Dumbbell Chest Press', 'Dumbbell Press sa Dibdib', 'strength', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbells'], 'beginner',
 ARRAY['Lie on bench or floor with dumbbells in hands', 'Start with arms extended above chest', 'Lower weights to chest level', 'Press back up to starting position'],
 ARRAY['Keep wrists straight and strong', 'Control the weight on the way down', 'Don''t bounce weights off chest', 'Keep feet flat on floor'],
 ARRAY['Lowering weights too fast', 'Pressing unevenly', 'Arching back excessively', 'Using too much weight'],
 'Builds chest strength and size using dumbbells',
 ARRAY['Builds chest muscle', 'Improves pushing strength', 'Works stabilizer muscles', 'Good for muscle balance'],
 ARRAY['Use spotter for heavy weights', 'Don''t drop weights on yourself'],
 '{"beginner": ["Light weights", "Floor press"], "advanced": ["Incline press", "Single-arm press"]}'::jsonb),

('Dumbbell Rows', 'Dumbbell Row', 'strength', ARRAY['back', 'biceps', 'rear_delts'], ARRAY['dumbbells'], 'beginner',
 ARRAY['Bend over with dumbbell in one hand', 'Support yourself with other hand on bench', 'Pull weight up to your ribs', 'Lower with control'],
 ARRAY['Keep back straight throughout', 'Pull with your back, not just arms', 'Don''t rotate your torso', 'Squeeze shoulder blades together'],
 ARRAY['Rounding the back', 'Using momentum', 'Not pulling high enough', 'Twisting the body'],
 'Excellent back exercise that builds pulling strength',
 ARRAY['Strengthens back muscles', 'Improves posture', 'Balances pushing exercises', 'Works core stability'],
 ARRAY['Keep back neutral to avoid injury', 'Don''t use too much weight initially'],
 '{"beginner": ["Supported rows", "Light weight"], "advanced": ["Single-arm rows", "Bent-over rows"]}'::jsonb),

-- Filipino-context exercises
('Jumping Jacks', 'Jumping Jack', 'cardio', ARRAY['full_body'], ARRAY['bodyweight'], 'beginner',
 ARRAY['Start standing with feet together, arms at sides', 'Jump feet apart while raising arms overhead', 'Jump back to starting position', 'Repeat in rhythm'],
 ARRAY['Land softly on balls of feet', 'Keep movements controlled', 'Breathe regularly', 'Start slow and build speed'],
 ARRAY['Landing too hard', 'Moving too fast initially', 'Holding breath', 'Poor coordination'],
 'Great cardio exercise that gets your heart pumping',
 ARRAY['Improves cardiovascular health', 'Burns calories quickly', 'Warms up whole body', 'Easy to do anywhere'],
 ARRAY['Land softly to protect joints', 'Stop if you feel dizzy'],
 '{"beginner": ["Step-touch", "Arm circles only"], "advanced": ["Star jumps", "Plyometric jacks"]}'::jsonb),

('Planks', 'Plank', 'strength', ARRAY['core', 'shoulders'], ARRAY['bodyweight'], 'beginner',
 ARRAY['Start in push-up position', 'Lower to forearms', 'Keep body in straight line', 'Hold position'],
 ARRAY['Keep hips level', 'Don''t hold breath', 'Engage core muscles', 'Look down at floor'],
 ARRAY['Sagging hips', 'Piking hips up', 'Holding breath', 'Looking up'],
 'Isometric exercise that builds core strength and stability',
 ARRAY['Strengthens entire core', 'Improves posture', 'Builds endurance', 'Protects lower back'],
 ARRAY['Start with short holds', 'Stop if lower back hurts'],
 '{"beginner": ["Knee planks", "Wall planks"], "advanced": ["Side planks", "Plank variations"]}'::jsonb);

-- Create trigger for updated_at
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();