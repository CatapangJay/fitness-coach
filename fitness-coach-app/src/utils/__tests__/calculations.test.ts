import {
  calculateBMR,
  calculateTDEE,
  adjustCaloriesForGoal,
  calculateMacros,
  calculateCompleteTDEE,
  convertWeight,
  convertHeight,
} from '../calculations';

describe('TDEE Calculation Utilities', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR correctly for males using Mifflin-St Jeor equation', () => {
      // Test case: 25-year-old male, 70kg, 175cm
      const bmr = calculateBMR(25, 'male', 70, 175);
      // Expected: (10 * 70) + (6.25 * 175) - (5 * 25) + 5 = 700 + 1093.75 - 125 + 5 = 1673.75
      expect(bmr).toBeCloseTo(1673.75, 2);
    });

    it('should calculate BMR correctly for females using Mifflin-St Jeor equation', () => {
      // Test case: 30-year-old female, 60kg, 165cm
      const bmr = calculateBMR(30, 'female', 60, 165);
      // Expected: (10 * 60) + (6.25 * 165) - (5 * 30) - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
      expect(bmr).toBeCloseTo(1320.25, 2);
    });

    it('should handle edge cases with minimum values', () => {
      const bmr = calculateBMR(18, 'female', 40, 150);
      expect(bmr).toBeGreaterThan(0);
      expect(typeof bmr).toBe('number');
    });

    it('should handle edge cases with maximum values', () => {
      const bmr = calculateBMR(80, 'male', 120, 200);
      expect(bmr).toBeGreaterThan(0);
      expect(typeof bmr).toBe('number');
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE correctly for sedentary activity level', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, 'sedentary');
      // Expected: 1500 * 1.2 = 1800
      expect(tdee).toBe(1800);
    });

    it('should calculate TDEE correctly for lightly active level', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, 'lightly-active');
      // Expected: 1500 * 1.375 = 2062.5
      expect(tdee).toBe(2062.5);
    });

    it('should calculate TDEE correctly for moderately active level', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, 'moderately-active');
      // Expected: 1500 * 1.55 = 2325
      expect(tdee).toBe(2325);
    });

    it('should calculate TDEE correctly for very active level', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, 'very-active');
      // Expected: 1500 * 1.725 = 2587.5
      expect(tdee).toBe(2587.5);
    });
  });

  describe('adjustCaloriesForGoal', () => {
    it('should adjust calories correctly for bulking goal', () => {
      const tdee = 2000;
      const adjusted = adjustCaloriesForGoal(tdee, 'bulking');
      // Expected: 2000 + average of (200, 500) = 2000 + 350 = 2350
      expect(adjusted).toBe(2350);
    });

    it('should adjust calories correctly for cutting goal', () => {
      const tdee = 2000;
      const adjusted = adjustCaloriesForGoal(tdee, 'cutting');
      // Expected: 2000 + average of (-500, -300) = 2000 + (-400) = 1600
      expect(adjusted).toBe(1600);
    });

    it('should not adjust calories for maintain goal', () => {
      const tdee = 2000;
      const adjusted = adjustCaloriesForGoal(tdee, 'maintain');
      // Expected: 2000 + 0 = 2000
      expect(adjusted).toBe(2000);
    });

    it('should return rounded values', () => {
      const tdee = 2001.7;
      const adjusted = adjustCaloriesForGoal(tdee, 'bulking');
      expect(Number.isInteger(adjusted)).toBe(true);
    });
  });

  describe('calculateMacros', () => {
    it('should calculate macros correctly for bulking goal', () => {
      const targetCalories = 2400;
      const macros = calculateMacros(targetCalories, 'bulking');
      
      // Bulking ratios: protein 25%, carbs 45%, fats 30%
      // Protein: 2400 * 0.25 = 600 calories = 150g (600/4)
      // Carbs: 2400 * 0.45 = 1080 calories = 270g (1080/4)
      // Fats: 2400 * 0.30 = 720 calories = 80g (720/9)
      
      expect(macros.protein.calories).toBe(600);
      expect(macros.protein.grams).toBe(150);
      expect(macros.carbs.calories).toBe(1080);
      expect(macros.carbs.grams).toBe(270);
      expect(macros.fats.calories).toBe(720);
      expect(macros.fats.grams).toBe(80);
    });

    it('should calculate macros correctly for cutting goal', () => {
      const targetCalories = 1800;
      const macros = calculateMacros(targetCalories, 'cutting');
      
      // Cutting ratios: protein 35%, carbs 35%, fats 30%
      // Protein: 1800 * 0.35 = 630 calories = 158g (rounded from 157.5)
      // Carbs: 1800 * 0.35 = 630 calories = 158g (rounded from 157.5)
      // Fats: 1800 * 0.30 = 540 calories = 60g
      
      expect(macros.protein.calories).toBe(630);
      expect(macros.protein.grams).toBe(158);
      expect(macros.carbs.calories).toBe(630);
      expect(macros.carbs.grams).toBe(158);
      expect(macros.fats.calories).toBe(540);
      expect(macros.fats.grams).toBe(60);
    });

    it('should calculate macros correctly for maintain goal', () => {
      const targetCalories = 2000;
      const macros = calculateMacros(targetCalories, 'maintain');
      
      // Maintain ratios: protein 30%, carbs 40%, fats 30%
      // Protein: 2000 * 0.30 = 600 calories = 150g
      // Carbs: 2000 * 0.40 = 800 calories = 200g
      // Fats: 2000 * 0.30 = 600 calories = 67g (rounded from 66.67)
      
      expect(macros.protein.calories).toBe(600);
      expect(macros.protein.grams).toBe(150);
      expect(macros.carbs.calories).toBe(800);
      expect(macros.carbs.grams).toBe(200);
      expect(macros.fats.calories).toBe(600);
      expect(macros.fats.grams).toBe(67);
    });

    it('should return rounded values for grams and calories', () => {
      const targetCalories = 2333; // Odd number to test rounding
      const macros = calculateMacros(targetCalories, 'maintain');
      
      expect(Number.isInteger(macros.protein.grams)).toBe(true);
      expect(Number.isInteger(macros.protein.calories)).toBe(true);
      expect(Number.isInteger(macros.carbs.grams)).toBe(true);
      expect(Number.isInteger(macros.carbs.calories)).toBe(true);
      expect(Number.isInteger(macros.fats.grams)).toBe(true);
      expect(Number.isInteger(macros.fats.calories)).toBe(true);
    });
  });

  describe('calculateCompleteTDEE', () => {
    it('should calculate complete TDEE correctly for a typical user', () => {
      // 25-year-old male, 70kg, 175cm, moderately active, bulking
      const result = calculateCompleteTDEE(
        25, 'male', 70, 175, 'moderately-active', 'bulking'
      );
      
      // BMR: 1673.75 (rounded to 1674)
      // TDEE: 1674 * 1.55 = 2594.7 (rounded to 2595)
      // Target: 2595 + 350 = 2945
      
      expect(result.bmr).toBe(1674);
      expect(result.tdee).toBe(2595);
      expect(result.targetCalories).toBe(2945);
      expect(result.macros).toBeDefined();
      expect(result.macros.protein).toBeDefined();
      expect(result.macros.carbs).toBeDefined();
      expect(result.macros.fats).toBeDefined();
    });

    it('should calculate complete TDEE correctly for a female cutting', () => {
      // 30-year-old female, 60kg, 165cm, lightly active, cutting
      const result = calculateCompleteTDEE(
        30, 'female', 60, 165, 'lightly-active', 'cutting'
      );
      
      // BMR: 1320.25 (rounded to 1320)
      // TDEE: 1320 * 1.375 = 1815
      // Target: 1815 - 400 = 1415
      
      expect(result.bmr).toBe(1320);
      expect(result.tdee).toBe(1815);
      expect(result.targetCalories).toBe(1415);
      expect(result.macros).toBeDefined();
    });

    it('should return all values as integers', () => {
      const result = calculateCompleteTDEE(
        27, 'male', 75.5, 180.3, 'very-active', 'maintain'
      );
      
      expect(Number.isInteger(result.bmr)).toBe(true);
      expect(Number.isInteger(result.tdee)).toBe(true);
      expect(Number.isInteger(result.targetCalories)).toBe(true);
    });
  });

  describe('convertWeight', () => {
    it('should convert pounds to kilograms correctly', () => {
      const kg = convertWeight(154, 'lbs', 'kg');
      expect(kg).toBeCloseTo(69.85, 2);
    });

    it('should convert kilograms to pounds correctly', () => {
      const lbs = convertWeight(70, 'kg', 'lbs');
      expect(lbs).toBeCloseTo(154.32, 2);
    });

    it('should return same value when units are the same', () => {
      expect(convertWeight(70, 'kg', 'kg')).toBe(70);
      expect(convertWeight(154, 'lbs', 'lbs')).toBe(154);
    });

    it('should handle decimal values correctly', () => {
      const kg = convertWeight(150.5, 'lbs', 'kg');
      expect(kg).toBeCloseTo(68.26, 2);
    });

    it('should handle zero and negative values', () => {
      expect(convertWeight(0, 'lbs', 'kg')).toBe(0);
      expect(convertWeight(-10, 'kg', 'lbs')).toBeCloseTo(-22.05, 2);
    });
  });

  describe('convertHeight', () => {
    it('should convert feet to centimeters correctly', () => {
      const cm = convertHeight(5.75, 'ft-in', 'cm'); // 5'9" (5 feet + 0.75*12 = 9 inches)
      // 5'9" = 69 inches = 69 * 2.54 = 175.26 cm
      expect(cm).toBeCloseTo(175.26, 2);
    });

    it('should convert 6 feet to centimeters correctly', () => {
      const cm = convertHeight(6.0, 'ft-in', 'cm'); // 6'0"
      // 6'0" = 72 inches = 72 * 2.54 = 182.88 cm
      expect(cm).toBeCloseTo(182.88, 2);
    });

    it('should convert centimeters to feet correctly', () => {
      const ft = convertHeight(175, 'cm', 'ft-in');
      // 175cm = 68.9 inches = 5 feet 8.9 inches = 5.74 feet
      expect(ft).toBeCloseTo(5.74, 2);
    });

    it('should convert 180cm to feet correctly', () => {
      const ft = convertHeight(180, 'cm', 'ft-in');
      // 180cm = 70.87 inches = 5 feet 10.87 inches = 5.91 feet
      expect(ft).toBeCloseTo(5.91, 2);
    });

    it('should return same value when units are the same', () => {
      expect(convertHeight(175, 'cm', 'cm')).toBe(175);
      expect(convertHeight(5.75, 'ft-in', 'ft-in')).toBe(5.75);
    });

    it('should handle round trip conversions accurately', () => {
      const originalCm = 170;
      const ft = convertHeight(originalCm, 'cm', 'ft-in');
      const backToCm = convertHeight(ft, 'ft-in', 'cm');
      expect(backToCm).toBeCloseTo(originalCm, 1);
    });

    it('should handle edge cases', () => {
      // Test 5'0" exactly
      const cm = convertHeight(5.0, 'ft-in', 'cm');
      expect(cm).toBeCloseTo(152.4, 2); // 60 inches * 2.54
      
      // Test very tall height
      const tallCm = convertHeight(7.0, 'ft-in', 'cm');
      expect(tallCm).toBeCloseTo(213.36, 2); // 84 inches * 2.54
    });
  });
});