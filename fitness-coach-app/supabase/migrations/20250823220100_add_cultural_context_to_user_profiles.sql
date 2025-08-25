-- Add cultural context fields to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS work_schedule TEXT CHECK (work_schedule IN ('day', 'night', 'flex')),
  ADD COLUMN IF NOT EXISTS climate TEXT CHECK (climate IN ('hot', 'rainy', 'cool'));

-- Backfill defaults if desired (optional)
UPDATE user_profiles SET work_schedule = COALESCE(work_schedule, 'day');
UPDATE user_profiles SET climate = COALESCE(climate, 'hot');

-- Ensure updated_at is touched
UPDATE user_profiles SET updated_at = NOW() WHERE TRUE;
