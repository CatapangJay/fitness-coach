import {
  ACTIVITY_LEVELS,
  FITNESS_GOALS,
  MACRO_RATIOS,
  CALORIES_PER_GRAM,
} from "@/constants";
import type { TDEECalculation } from "@/types";

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  age: number,
  gender: "male" | "female",
  weightKg: number,
  heightCm: number
): number {
  const baseCalories = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? baseCalories + 5 : baseCalories - 161;
}

/**
 * Calculate TDEE from BMR and activity level
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: keyof typeof ACTIVITY_LEVELS
): number {
  return bmr * ACTIVITY_LEVELS[activityLevel].multiplier;
}

/**
 * Adjust calories based on fitness goal
 */
export function adjustCaloriesForGoal(
  tdee: number,
  goal: keyof typeof FITNESS_GOALS
): number {
  const adjustment = FITNESS_GOALS[goal].calorieAdjustment;
  const avgAdjustment = (adjustment.min + adjustment.max) / 2;
  return Math.round(tdee + avgAdjustment);
}

/**
 * Calculate macronutrient breakdown
 */
export function calculateMacros(
  targetCalories: number,
  goal: keyof typeof FITNESS_GOALS
): TDEECalculation["macros"] {
  const ratios = MACRO_RATIOS[goal];

  const proteinCalories = targetCalories * ratios.protein;
  const carbsCalories = targetCalories * ratios.carbs;
  const fatsCalories = targetCalories * ratios.fats;

  return {
    protein: {
      grams: Math.round(proteinCalories / CALORIES_PER_GRAM.protein),
      calories: Math.round(proteinCalories),
    },
    carbs: {
      grams: Math.round(carbsCalories / CALORIES_PER_GRAM.carbs),
      calories: Math.round(carbsCalories),
    },
    fats: {
      grams: Math.round(fatsCalories / CALORIES_PER_GRAM.fats),
      calories: Math.round(fatsCalories),
    },
  };
}

/**
 * Complete TDEE calculation with all components
 */
export function calculateCompleteTDEE(
  age: number,
  gender: "male" | "female",
  weightKg: number,
  heightCm: number,
  activityLevel: keyof typeof ACTIVITY_LEVELS,
  goal: keyof typeof FITNESS_GOALS
): TDEECalculation {
  const bmr = calculateBMR(age, gender, weightKg, heightCm);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = adjustCaloriesForGoal(tdee, goal);
  const macros = calculateMacros(targetCalories, goal);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    macros,
  };
}

/**
 * Convert weight units
 */
export function convertWeight(
  value: number,
  from: "kg" | "lbs",
  to: "kg" | "lbs"
): number {
  if (from === to) return value;
  if (from === "lbs" && to === "kg") return value * 0.453592;
  if (from === "kg" && to === "lbs") return value * 2.20462;
  return value;
}

/**
 * Convert height units
 * For ft-in format, value represents feet with decimal inches (e.g., 5.75 = 5'9")
 */
export function convertHeight(
  value: number,
  from: "cm" | "ft-in",
  to: "cm" | "ft-in"
): number {
  if (from === to) return value;
  
  if (from === "ft-in" && to === "cm") {
    // Convert feet.inches to total inches, then to cm
    const feet = Math.floor(value);
    const inches = (value - feet) * 12; // Convert decimal part to inches
    const totalInches = feet * 12 + inches;
    return totalInches * 2.54;
  }
  
  if (from === "cm" && to === "ft-in") {
    // Convert cm to total inches, then to feet.inches format
    const totalInches = value / 2.54;
    const feet = Math.floor(totalInches / 12);
    const remainingInches = totalInches % 12;
    return feet + (remainingInches / 12); // Return as decimal feet
  }
  
  return value;
}
