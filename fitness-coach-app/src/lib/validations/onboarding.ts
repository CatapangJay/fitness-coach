import { z } from "zod"

// Personal Information Schema
export const personalInfoSchema = z.object({
  age: z.number().min(13, "Must be at least 13 years old").max(100, "Must be under 100 years old"),
  gender: z.enum(["male", "female"], {
    message: "Please select your gender",
  }),
  height: z.object({
    value: z.number().min(1, "Height is required"),
    unit: z.enum(["cm", "ft-in"]),
  }),
  weight: z.object({
    value: z.number().min(1, "Weight is required"),
    unit: z.enum(["kg", "lbs"]),
  }),
})

// Fitness Profile Schema
export const fitnessProfileSchema = z.object({
  bodyComposition: z.enum(["skinny", "skinny-fat", "average", "overweight", "obese"], {
    message: "Please select your body composition",
  }),
  goal: z.enum(["bulking", "cutting", "maintain"], {
    message: "Please select your fitness goal",
  }),
  activityLevel: z.enum(["sedentary", "lightly-active", "moderately-active", "very-active"], {
    message: "Please select youect your activity level",
  }),
  workoutFrequency: z.number().min(1, "Must workout at least 1 day per week").max(7, "Cannot workout more than 7 days per week"),
  availableEquipment: z.array(z.string()).min(1, "Please select at least one equipment option"),
})

// Complete Onboarding Schema
export const onboardingSchema = z.object({
  personalInfo: personalInfoSchema,
  fitnessProfile: fitnessProfileSchema,
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type FitnessProfileFormData = z.infer<typeof fitnessProfileSchema>
export type OnboardingFormData = z.infer<typeof onboardingSchema>