-- Seed exercises with Filipino-friendly options
INSERT INTO exercises (name, name_filipino, category, muscle_groups, equipment, difficulty, instructions, form_tips, common_mistakes, is_popular_in_ph) VALUES

-- Bodyweight Exercises (No Equipment)
('Push-ups', 'Push-up', 'strength', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['home'], 'beginner', 
 ARRAY['Start in plank position with hands shoulder-width apart', 'Lower your body until chest nearly touches floor', 'Push back up to starting position', 'Keep your body straight throughout'],
 ARRAY['Keep core tight', 'Don''t let hips sag', 'Full range of motion'], 
 ARRAY['Sagging hips', 'Partial range of motion', 'Flaring elbows too wide'], true),

('Squats', 'Squat', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['home'], 'beginner',
 ARRAY['Stand with feet shoulder-width apart', 'Lower body as if sitting back into chair', 'Keep chest up and knees behind toes', 'Return to standing position'],
 ARRAY['Keep weight on heels', 'Chest up, back straight', 'Knees track over toes'],
 ARRAY['Knees caving inward', 'Leaning too far forward', 'Not going deep enough'], true),

('Lunges', 'Lunge', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['home'], 'beginner',
 ARRAY['Step forward with one leg', 'Lower hips until both knees are 90 degrees', 'Push back to starting position', 'Repeat with other leg'],
 ARRAY['Keep front knee over ankle', 'Don''t let back knee touch ground', 'Keep torso upright'],
 ARRAY['Knee going past toes', 'Leaning forward', 'Taking too small steps'], true),

('Plank', 'Plank', 'strength', ARRAY['core', 'shoulders'], ARRAY['home'], 'beginner',
 ARRAY['Start in push-up position', 'Hold body straight from head to heels', 'Keep core engaged', 'Breathe normally'],
 ARRAY['Keep hips level', 'Don''t hold breath', 'Engage core muscles'],
 ARRAY['Sagging hips', 'Raising hips too high', 'Holding breath'], true),

('Burpees', 'Burpee', 'cardio', ARRAY['full-body'], ARRAY['home'], 'intermediate',
 ARRAY['Start standing', 'Drop into squat, place hands on floor', 'Jump feet back to plank', 'Do push-up', 'Jump feet to squat', 'Jump up with arms overhead'],
 ARRAY['Land softly', 'Keep core tight during plank', 'Full extension on jump'],
 ARRAY['Landing hard', 'Sagging in plank position', 'Rushing through movements'], true),

('Mountain Climbers', 'Mountain Climber', 'cardio', ARRAY['core', 'shoulders', 'legs'], ARRAY['home'], 'intermediate',
 ARRAY['Start in plank position', 'Bring one knee toward chest', 'Quickly switch legs', 'Keep hips level throughout'],
 ARRAY['Keep core engaged', 'Don''t bounce hips', 'Control the movement'],
 ARRAY['Hips bouncing up and down', 'Going too fast', 'Losing plank position'], true),

-- Dumbbell Exercises
('Dumbbell Chest Press', 'Dumbbell Press sa Dibdib', 'strength', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbells'], 'beginner',
 ARRAY['Lie on bench or floor with dumbbells', 'Press weights up over chest', 'Lower with control', 'Press back up'],
 ARRAY['Keep wrists straight', 'Control the descent', 'Full range of motion'],
 ARRAY['Bouncing weights off chest', 'Pressing too fast', 'Uneven arm movement'], true),

('Dumbbell Rows', 'Dumbbell Row', 'strength', ARRAY['back', 'biceps'], ARRAY['dumbbells'], 'beginner',
 ARRAY['Bend over with dumbbell in one hand', 'Pull weight to hip', 'Lower with control', 'Keep back straight'],
 ARRAY['Squeeze shoulder blades', 'Keep core tight', 'Don''t rotate torso'],
 ARRAY['Using momentum', 'Rotating body', 'Not squeezing at top'], true),

('Dumbbell Shoulder Press', 'Dumbbell Press sa Balikat', 'strength', ARRAY['shoulders', 'triceps'], ARRAY['dumbbells'], 'beginner',
 ARRAY['Hold dumbbells at shoulder height', 'Press weights overhead', 'Lower with control', 'Keep core engaged'],
 ARRAY['Don''t arch back excessively', 'Press straight up', 'Control the weight'],
 ARRAY['Arching back too much', 'Pressing forward', 'Using legs to help'], true),

('Dumbbell Bicep Curls', 'Dumbbell Curl sa Braso', 'strength', ARRAY['biceps'], ARRAY['dumbbells'], 'beginner',
 ARRAY['Hold dumbbells at sides', 'Curl weights up to shoulders', 'Lower with control', 'Keep elbows at sides'],
 ARRAY['Don''t swing weights', 'Squeeze at the top', 'Control the negative'],
 ARRAY['Swinging the weights', 'Moving elbows', 'Partial range of motion'], true),

-- Resistance Band Exercises
('Resistance Band Rows', 'Band Row', 'strength', ARRAY['back', 'biceps'], ARRAY['resistance-bands'], 'beginner',
 ARRAY['Anchor band at chest height', 'Pull handles to chest', 'Squeeze shoulder blades', 'Return with control'],
 ARRAY['Keep elbows close to body', 'Don''t lean back', 'Squeeze shoulder blades'],
 ARRAY['Using momentum', 'Leaning back', 'Not squeezing shoulder blades'], true),

('Resistance Band Chest Press', 'Band Press sa Dibdib', 'strength', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['resistance-bands'], 'beginner',
 ARRAY['Anchor band behind you', 'Press handles forward', 'Bring hands together', 'Return with control'],
 ARRAY['Keep core engaged', 'Don''t lean forward', 'Control the return'],
 ARRAY['Leaning forward', 'Rushing the movement', 'Not bringing hands together'], true),

-- Pull-up Bar Exercises
('Pull-ups', 'Pull-up', 'strength', ARRAY['back', 'biceps'], ARRAY['pull-up-bar'], 'intermediate',
 ARRAY['Hang from bar with overhand grip', 'Pull body up until chin over bar', 'Lower with control', 'Repeat'],
 ARRAY['Don''t swing', 'Full range of motion', 'Engage lats'],
 ARRAY['Swinging body', 'Partial range of motion', 'Using momentum'], true),

('Chin-ups', 'Chin-up', 'strength', ARRAY['back', 'biceps'], ARRAY['pull-up-bar'], 'intermediate',
 ARRAY['Hang from bar with underhand grip', 'Pull body up until chin over bar', 'Lower with control', 'Repeat'],
 ARRAY['Squeeze shoulder blades', 'Don''t swing', 'Control the descent'],
 ARRAY['Swinging', 'Not going full range', 'Dropping too fast'], true),

-- Gym Machine Exercises
('Lat Pulldown', 'Lat Pulldown', 'strength', ARRAY['back', 'biceps'], ARRAY['gym-machines'], 'beginner',
 ARRAY['Sit at machine with thighs under pads', 'Pull bar down to upper chest', 'Squeeze shoulder blades', 'Return with control'],
 ARRAY['Lean back slightly', 'Pull to chest, not neck', 'Don''t use momentum'],
 ARRAY['Pulling behind neck', 'Using too much momentum', 'Not squeezing shoulder blades'], false),

('Leg Press', 'Leg Press', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['gym-machines'], 'beginner',
 ARRAY['Sit in machine with feet on platform', 'Lower weight by bending knees', 'Press back to starting position', 'Don''t lock knees'],
 ARRAY['Keep knees aligned with toes', 'Don''t go too deep', 'Control the weight'],
 ARRAY['Knees caving in', 'Going too deep', 'Locking knees at top'], false),

-- Cardio Exercises
('Jumping Jacks', 'Jumping Jack', 'cardio', ARRAY['full-body'], ARRAY['home'], 'beginner',
 ARRAY['Start with feet together, arms at sides', 'Jump feet apart while raising arms overhead', 'Jump back to starting position', 'Repeat rhythmically'],
 ARRAY['Land softly', 'Keep core engaged', 'Maintain rhythm'],
 ARRAY['Landing hard', 'Going too fast', 'Poor coordination'], true),

('High Knees', 'High Knees', 'cardio', ARRAY['legs', 'core'], ARRAY['home'], 'beginner',
 ARRAY['Stand in place', 'Lift knees toward chest alternately', 'Pump arms as if running', 'Maintain quick pace'],
 ARRAY['Lift knees high', 'Stay on balls of feet', 'Keep core tight'],
 ARRAY['Not lifting knees high enough', 'Leaning back', 'Going too slow'], true),

-- Filipino Traditional Exercises
('Tinikling Steps', 'Tinikling', 'cardio', ARRAY['legs', 'coordination'], ARRAY['home'], 'beginner',
 ARRAY['Step in and out of imaginary bamboo poles', 'Follow traditional tinikling rhythm', 'Keep light on feet', 'Maintain coordination'],
 ARRAY['Stay light on feet', 'Follow the rhythm', 'Keep knees soft'],
 ARRAY['Heavy footwork', 'Poor timing', 'Stiff movements'], true);

-- Add some alternatives and progression paths
UPDATE exercises SET alternatives = ARRAY[
  (SELECT id FROM exercises WHERE name = 'Knee Push-ups' LIMIT 1)
] WHERE name = 'Push-ups';

UPDATE exercises SET progression_path = ARRAY[
  (SELECT id FROM exercises WHERE name = 'Wall Push-ups' LIMIT 1),
  (SELECT id FROM exercises WHERE name = 'Knee Push-ups' LIMIT 1),
  (SELECT id FROM exercises WHERE name = 'Push-ups' LIMIT 1),
  (SELECT id FROM exercises WHERE name = 'Diamond Push-ups' LIMIT 1)
] WHERE name = 'Push-ups';