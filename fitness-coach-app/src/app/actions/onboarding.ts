"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { OnboardingFormData } from "@/lib/validations/onboarding"
import { calculateCompleteTDEE, convertWeight, convertHeight } from "@/utils/calculations"
import { UserProfile } from "@/lib/supabase"

export async function saveUserProfile(formData: OnboardingFormData) {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("User not authenticated")
    }

    const { personalInfo, fitnessProfile } = formData

    // Convert measurements to metric for calculations
    const weightKg = convertWeight(
      personalInfo.weight.value,
      personalInfo.weight.unit,
      "kg"
    )
    
    const heightCm = convertHeight(
      personalInfo.height.value,
      personalInfo.height.unit,
      "cm"
    )

    // Calculate TDEE and macros
    const tdeeCalculation = calculateCompleteTDEE(
      personalInfo.age,
      personalInfo.gender,
      weightKg,
      heightCm,
      fitnessProfile.activityLevel,
      fitnessProfile.goal
    )

    // Prepare user profile data for database
    const userProfileData: Partial<UserProfile> = {
      user_id: user.id,
      age: personalInfo.age,
      gender: personalInfo.gender,
      height_value: personalInfo.height.value,
      height_unit: personalInfo.height.unit,
      weight_value: personalInfo.weight.value,
      weight_unit: personalInfo.weight.unit,
      body_composition: fitnessProfile.bodyComposition,
      goal: fitnessProfile.goal,
      activity_level: fitnessProfile.activityLevel,
      workout_frequency: fitnessProfile.workoutFrequency,
      available_equipment: fitnessProfile.availableEquipment,
      bmr: tdeeCalculation.bmr,
      tdee: tdeeCalculation.tdee,
      target_calories: tdeeCalculation.targetCalories,
      protein_grams: tdeeCalculation.macros.protein.grams,
      protein_calories: tdeeCalculation.macros.protein.calories,
      carbs_grams: tdeeCalculation.macros.carbs.grams,
      carbs_calories: tdeeCalculation.macros.carbs.calories,
      fats_grams: tdeeCalculation.macros.fats.grams,
      fats_calories: tdeeCalculation.macros.fats.calories,
      language: "en", // Default to English, can be updated later
      units: personalInfo.height.unit === "cm" && personalInfo.weight.unit === "kg" ? "metric" : "imperial",
      notifications: true, // Default to enabled
      updated_at: new Date().toISOString(),
    }

    // Upsert user profile (insert or update if exists)
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .upsert(userProfileData, { 
        onConflict: "user_id",
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (profileError) {
      console.error("Error saving user profile:", profileError)
      throw new Error("Failed to save user profile")
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard")
    revalidatePath("/profile")

    return {
      success: true,
      data: profile,
      tdeeCalculation,
    }
  } catch (error) {
    console.error("Error in saveUserProfile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getUserProfile() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      if (profileError.code === "PGRST116") {
        // No profile found - this is expected for new users
        return {
          success: true,
          data: null,
        }
      }
      
      console.error("Error fetching user profile:", profileError)
      throw new Error("Failed to fetch user profile")
    }

    return {
      success: true,
      data: profile,
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function checkProfileCompletion() {
  try {
    const profileResult = await getUserProfile()
    
    if (!profileResult.success) {
      return {
        success: false,
        error: profileResult.error,
      }
    }

    const profile = profileResult.data
    
    // Check if profile exists and has required fields
    const isComplete = profile && 
      profile.age && 
      profile.gender && 
      profile.height_value && 
      profile.weight_value && 
      profile.body_composition && 
      profile.goal && 
      profile.activity_level && 
      profile.workout_frequency && 
      profile.available_equipment && 
      profile.available_equipment.length > 0

    return {
      success: true,
      isComplete: !!isComplete,
      profile,
    }
  } catch (error) {
    console.error("Error in checkProfileCompletion:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}