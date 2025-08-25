// App constants and configuration
export const APP_CONFIG = {
  name: 'Fitness Coach App',
  shortName: 'FitnessCoach',
  description: 'Your personalized Filipino fitness coach',
  version: '1.0.0',
} as const;

export const ACTIVITY_LEVELS = {
  sedentary: {
    multiplier: 1.2,
    label: 'Sedentary (Desk Job)',
    description: 'Little or no exercise, desk job'
  },
  'lightly-active': {
    multiplier: 1.375,
    label: 'Lightly Active',
    description: 'Light exercise 1-3 days/week'
  },
  'moderately-active': {
    multiplier: 1.55,
    label: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week'
  },
  'very-active': {
    multiplier: 1.725,
    label: 'Very Active',
    description: 'Hard exercise 6-7 days/week'
  }
} as const;

export const BODY_COMPOSITIONS = {
  skinny: {
    label: 'Skinny',
    description: 'Low body fat, low muscle mass'
  },
  'skinny-fat': {
    label: 'Skinny Fat',
    description: 'Normal weight but high body fat percentage'
  },
  average: {
    label: 'Average',
    description: 'Normal body composition'
  },
  overweight: {
    label: 'Overweight',
    description: 'Above normal weight range'
  },
  obese: {
    label: 'Obese',
    description: 'Significantly above normal weight range'
  }
} as const;

export const FITNESS_GOALS = {
  bulking: {
    label: 'Bulking (Muscle Gain)',
    description: 'Build muscle mass and strength',
    calorieAdjustment: { min: 200, max: 500 }
  },
  cutting: {
    label: 'Cutting (Fat Loss)',
    description: 'Lose body fat while maintaining muscle',
    calorieAdjustment: { min: -500, max: -300 }
  },
  maintain: {
    label: 'Maintain',
    description: 'Maintain current weight and body composition',
    calorieAdjustment: { min: 0, max: 0 }
  }
} as const;

export const EQUIPMENT_OPTIONS = [
  'home',
  'dumbbells',
  'barbells',
  'gym-machines',
  'resistance-bands',
  'pull-up-bar',
  'kettlebells',
  'cable-machine'
] as const;

export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'glutes',
  'core',
  'calves',
  'forearms'
] as const;

export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'merienda',
  'dinner'
] as const;

export const MACRO_RATIOS = {
  bulking: {
    protein: 0.25, // 25% of calories
    carbs: 0.45,   // 45% of calories
    fats: 0.30     // 30% of calories
  },
  cutting: {
    protein: 0.35, // 35% of calories
    carbs: 0.35,   // 35% of calories
    fats: 0.30     // 30% of calories
  },
  maintain: {
    protein: 0.30, // 30% of calories
    carbs: 0.40,   // 40% of calories
    fats: 0.30     // 30% of calories
  }
} as const;

export const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fats: 9
} as const;