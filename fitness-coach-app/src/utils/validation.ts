import { z } from 'zod';

// Validation schemas for forms
export const personalInfoSchema = z.object({
  age: z.number().min(13).max(100),
  gender: z.enum(['male', 'female']),
  height: z.object({
    value: z.number().min(100).max(250), // cm or inches
    unit: z.enum(['cm', 'ft-in'])
  }),
  weight: z.object({
    value: z.number().min(30).max(300), // kg or lbs
    unit: z.enum(['kg', 'lbs'])
  })
});

export const fitnessProfileSchema = z.object({
  bodyComposition: z.enum(['skinny', 'skinny-fat', 'average', 'overweight', 'obese']),
  goal: z.enum(['bulking', 'cutting', 'maintain']),
  activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active']),
  workoutFrequency: z.number().min(1).max(7),
  availableEquipment: z.array(z.string()).min(1)
});

export const onboardingSchema = z.object({
  personalInfo: personalInfoSchema,
  fitnessProfile: fitnessProfileSchema
});

// Validation helper functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}