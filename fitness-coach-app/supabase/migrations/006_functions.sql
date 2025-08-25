-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at 
    BEFORE UPDATE ON workout_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at 
    BEFORE UPDATE ON meal_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate TDEE
CREATE OR REPLACE FUNCTION calculate_tdee(
    age INTEGER,
    gender TEXT,
    weight_kg DECIMAL,
    height_cm DECIMAL,
    activity_level TEXT
) RETURNS DECIMAL AS $$
DECLARE
    bmr DECIMAL;
    activity_multiplier DECIMAL;
BEGIN
    -- Calculate BMR using Mifflin-St Jeor equation
    IF gender = 'male' THEN
        bmr := (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
    ELSE
        bmr := (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
    END IF;
    
    -- Apply activity level multiplier
    CASE activity_level
        WHEN 'sedentary' THEN activity_multiplier := 1.2;
        WHEN 'lightly-active' THEN activity_multiplier := 1.375;
        WHEN 'moderately-active' THEN activity_multiplier := 1.55;
        WHEN 'very-active' THEN activity_multiplier := 1.725;
        ELSE activity_multiplier := 1.2; -- default to sedentary
    END CASE;
    
    RETURN bmr * activity_multiplier;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate target calories based on goal
CREATE OR REPLACE FUNCTION calculate_target_calories(
    tdee DECIMAL,
    goal TEXT
) RETURNS DECIMAL AS $$
BEGIN
    CASE goal
        WHEN 'cutting' THEN RETURN tdee - 400; -- 400 calorie deficit
        WHEN 'bulking' THEN RETURN tdee + 300; -- 300 calorie surplus
        WHEN 'maintain' THEN RETURN tdee;
        ELSE RETURN tdee; -- default to maintenance
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate macronutrient breakdown
CREATE OR REPLACE FUNCTION calculate_macros(
    target_calories DECIMAL,
    goal TEXT
) RETURNS TABLE(
    protein_grams DECIMAL,
    protein_calories DECIMAL,
    carbs_grams DECIMAL,
    carbs_calories DECIMAL,
    fats_grams DECIMAL,
    fats_calories DECIMAL
) AS $$
DECLARE
    protein_ratio DECIMAL;
    fat_ratio DECIMAL;
    carb_ratio DECIMAL;
BEGIN
    -- Set macro ratios based on goal
    CASE goal
        WHEN 'cutting' THEN 
            protein_ratio := 0.35; -- 35% protein for muscle preservation
            fat_ratio := 0.25;     -- 25% fat
            carb_ratio := 0.40;    -- 40% carbs
        WHEN 'bulking' THEN
            protein_ratio := 0.25; -- 25% protein
            fat_ratio := 0.25;     -- 25% fat  
            carb_ratio := 0.50;    -- 50% carbs for energy
        ELSE -- maintain
            protein_ratio := 0.30; -- 30% protein
            fat_ratio := 0.25;     -- 25% fat
            carb_ratio := 0.45;    -- 45% carbs
    END CASE;
    
    -- Calculate calories for each macro
    protein_calories := target_calories * protein_ratio;
    fats_calories := target_calories * fat_ratio;
    carbs_calories := target_calories * carb_ratio;
    
    -- Convert to grams (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
    protein_grams := protein_calories / 4;
    carbs_grams := carbs_calories / 4;
    fats_grams := fat_calories / 9;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;