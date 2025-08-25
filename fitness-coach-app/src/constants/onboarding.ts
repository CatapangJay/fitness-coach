// Body composition options with user-friendly descriptions
export const BODY_COMPOSITION_OPTIONS = [
  {
    value: "skinny" as const,
    label: "Skinny",
    description: "Low body weight, minimal muscle mass and body fat"
  },
  {
    value: "skinny-fat" as const,
    label: "Skinny Fat",
    description: "Normal weight but higher body fat percentage, low muscle mass"
  },
  {
    value: "average" as const,
    label: "Average",
    description: "Normal weight and body composition for your height"
  },
  {
    value: "overweight" as const,
    label: "Overweight",
    description: "Above normal weight, may have excess body fat"
  },
  {
    value: "obese" as const,
    label: "Obese",
    description: "Significantly above normal weight with high body fat"
  }
]

// Fitness goals with clear descriptions
export const FITNESS_GOALS = [
  {
    value: "bulking" as const,
    label: "Bulking (Muscle Gain)",
    description: "Build muscle mass and strength by eating more calories and lifting weights"
  },
  {
    value: "cutting" as const,
    label: "Cutting (Fat Loss)",
    description: "Lose body fat while maintaining muscle by eating fewer calories and exercising"
  },
  {
    value: "maintain" as const,
    label: "Maintain",
    description: "Maintain current weight and body composition with balanced nutrition and exercise"
  }
]

// Activity levels with Filipino work context
export const ACTIVITY_LEVELS = [
  {
    value: "sedentary" as const,
    label: "Sedentary (Desk Job)",
    description: "Office work, minimal physical activity, mostly sitting throughout the day"
  },
  {
    value: "lightly-active" as const,
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week, some walking, occasional physical activity"
  },
  {
    value: "moderately-active" as const,
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week, regular physical activity or active job"
  },
  {
    value: "very-active" as const,
    label: "Very Active",
    description: "Hard exercise 6-7 days/week, very active job, or training for sports"
  }
]

// Available equipment options
export const EQUIPMENT_OPTIONS = [
  {
    value: "home",
    label: "Home Workout (No Equipment)",
    description: "Bodyweight exercises you can do at home"
  },
  {
    value: "dumbbells",
    label: "Dumbbells",
    description: "Adjustable or fixed weight dumbbells"
  },
  {
    value: "barbells",
    label: "Barbells",
    description: "Olympic barbell with weight plates"
  },
  {
    value: "machines",
    label: "Gym Machines",
    description: "Access to gym equipment and machines"
  },
  {
    value: "resistance-bands",
    label: "Resistance Bands",
    description: "Elastic bands for strength training"
  },
  {
    value: "pull-up-bar",
    label: "Pull-up Bar",
    description: "Doorway or wall-mounted pull-up bar"
  },
  {
    value: "kettlebells",
    label: "Kettlebells",
    description: "Cast iron or steel kettlebells"
  },
  {
    value: "cardio-equipment",
    label: "Cardio Equipment",
    description: "Treadmill, bike, elliptical, etc."
  }
]

// Workout frequency options
export const WORKOUT_FREQUENCY_OPTIONS = [
  { value: 1, label: "1 day per week", description: "Minimal commitment, basic maintenance" },
  { value: 2, label: "2 days per week", description: "Light routine, good for beginners" },
  { value: 3, label: "3 days per week", description: "Standard routine, balanced approach" },
  { value: 4, label: "4 days per week", description: "Active routine, good progress" },
  { value: 5, label: "5 days per week", description: "Dedicated routine, faster results" },
  { value: 6, label: "6 days per week", description: "Intensive routine, advanced level" },
  { value: 7, label: "7 days per week", description: "Daily routine, maximum commitment" }
]