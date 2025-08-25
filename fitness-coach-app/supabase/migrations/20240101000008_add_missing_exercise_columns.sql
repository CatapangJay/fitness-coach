-- Add missing columns to exercises table if they don't exist
DO $$ 
BEGIN
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exercises' AND column_name = 'description') THEN
        ALTER TABLE exercises ADD COLUMN description TEXT;
    END IF;

    -- Add benefits column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exercises' AND column_name = 'benefits') THEN
        ALTER TABLE exercises ADD COLUMN benefits TEXT[];
    END IF;

    -- Add safety_notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exercises' AND column_name = 'safety_notes') THEN
        ALTER TABLE exercises ADD COLUMN safety_notes TEXT[];
    END IF;

    -- Add modifications column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exercises' AND column_name = 'modifications') THEN
        ALTER TABLE exercises ADD COLUMN modifications JSONB;
    END IF;

    -- Add progression_path column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exercises' AND column_name = 'progression_path') THEN
        ALTER TABLE exercises ADD COLUMN progression_path TEXT[];
    END IF;

    -- Add alternative_exercises column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exercises' AND column_name = 'alternative_exercises') THEN
        ALTER TABLE exercises ADD COLUMN alternative_exercises TEXT[];
    END IF;

    -- Add calories_per_minute column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exercises' AND column_name = 'calories_per_minute') THEN
        ALTER TABLE exercises ADD COLUMN calories_per_minute DECIMAL;
    END IF;
END $$;

-- Update existing exercises with descriptions
UPDATE exercises SET description = 'Classic upper body exercise that builds chest, shoulders, and arm strength' WHERE name = 'Push-ups' AND description IS NULL;
UPDATE exercises SET description = 'Fundamental lower body exercise that targets legs and glutes' WHERE name = 'Squats' AND description IS NULL;
UPDATE exercises SET description = 'Builds chest strength and size using dumbbells' WHERE name = 'Dumbbell Chest Press' AND description IS NULL;
UPDATE exercises SET description = 'Excellent back exercise that builds pulling strength' WHERE name = 'Dumbbell Rows' AND description IS NULL;
UPDATE exercises SET description = 'Great cardio exercise that gets your heart pumping' WHERE name = 'Jumping Jacks' AND description IS NULL;
UPDATE exercises SET description = 'Isometric exercise that builds core strength and stability' WHERE name = 'Planks' AND description IS NULL;

-- Add benefits to existing exercises
UPDATE exercises SET benefits = ARRAY['Builds upper body strength', 'Improves core stability', 'No equipment needed', 'Can be done anywhere'] WHERE name = 'Push-ups' AND benefits IS NULL;
UPDATE exercises SET benefits = ARRAY['Strengthens entire lower body', 'Improves functional movement', 'Burns many calories', 'Builds core strength'] WHERE name = 'Squats' AND benefits IS NULL;
UPDATE exercises SET benefits = ARRAY['Builds chest muscle', 'Improves pushing strength', 'Works stabilizer muscles', 'Good for muscle balance'] WHERE name = 'Dumbbell Chest Press' AND benefits IS NULL;
UPDATE exercises SET benefits = ARRAY['Strengthens back muscles', 'Improves posture', 'Balances pushing exercises', 'Works core stability'] WHERE name = 'Dumbbell Rows' AND benefits IS NULL;
UPDATE exercises SET benefits = ARRAY['Improves cardiovascular health', 'Burns calories quickly', 'Warms up whole body', 'Easy to do anywhere'] WHERE name = 'Jumping Jacks' AND benefits IS NULL;
UPDATE exercises SET benefits = ARRAY['Strengthens entire core', 'Improves posture', 'Builds endurance', 'Protects lower back'] WHERE name = 'Planks' AND benefits IS NULL;

-- Add safety notes to existing exercises
UPDATE exercises SET safety_notes = ARRAY['Start slowly if you''re new to exercise', 'Stop if you feel sharp pain'] WHERE name = 'Push-ups' AND safety_notes IS NULL;
UPDATE exercises SET safety_notes = ARRAY['Don''t force depth if you have knee issues', 'Keep movements controlled'] WHERE name = 'Squats' AND safety_notes IS NULL;
UPDATE exercises SET safety_notes = ARRAY['Use spotter for heavy weights', 'Don''t drop weights on yourself'] WHERE name = 'Dumbbell Chest Press' AND safety_notes IS NULL;
UPDATE exercises SET safety_notes = ARRAY['Keep back neutral to avoid injury', 'Don''t use too much weight initially'] WHERE name = 'Dumbbell Rows' AND safety_notes IS NULL;
UPDATE exercises SET safety_notes = ARRAY['Land softly to protect joints', 'Stop if you feel dizzy'] WHERE name = 'Jumping Jacks' AND safety_notes IS NULL;
UPDATE exercises SET safety_notes = ARRAY['Start with short holds', 'Stop if lower back hurts'] WHERE name = 'Planks' AND safety_notes IS NULL;