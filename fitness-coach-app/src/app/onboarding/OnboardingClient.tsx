"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow"
import { OnboardingFormData } from "@/lib/validations/onboarding"
import { supabase, UserProfile } from "@/lib/supabase"
import { calculateCompleteTDEE, convertWeight, convertHeight } from "@/utils/calculations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface OnboardingClientProps {
  initialProfile?: UserProfile | null
}

export function OnboardingClient({ initialProfile }: OnboardingClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    error?: string
    data?: any
    tdeeCalculation?: any
  } | null>(null)

  // Convert database profile to form data if available
  const getInitialFormData = (): Partial<OnboardingFormData> | undefined => {
    if (!initialProfile) return undefined

    return {
      personalInfo: {
        age: initialProfile.age || 0,
        gender: initialProfile.gender || "male",
        height: {
          value: initialProfile.height_value || 0,
          unit: initialProfile.height_unit || "cm",
        },
        weight: {
          value: initialProfile.weight_value || 0,
          unit: initialProfile.weight_unit || "kg",
        },
      },
      fitnessProfile: {
        bodyComposition: initialProfile.body_composition || "average",
        goal: initialProfile.goal || "maintain",
        activityLevel: initialProfile.activity_level || "sedentary",
        workoutFrequency: initialProfile.workout_frequency || 3,
        availableEquipment: initialProfile.available_equipment || ["home"],
      },
    }
  }

  const handleOnboardingComplete = async (data: OnboardingFormData) => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      // Use client-side Supabase instead of server action
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("User not authenticated")
      }

      const { personalInfo, fitnessProfile } = data

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
      const userProfileData = {
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
        language: "en",
        units: personalInfo.height.unit === "cm" && personalInfo.weight.unit === "kg" ? "metric" : "imperial",
        notifications: true,
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
        throw new Error("Failed to save user profile: " + profileError.message)
      }

      setSubmitResult({
        success: true,
        data: profile,
        tdeeCalculation,
      })

      // Show success message briefly, then redirect
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error in handleOnboardingComplete:", error)
      setSubmitResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setSubmitResult(null)
  }

  // Show loading state while submitting
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <h3 className="font-semibold">Setting up your profile...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We're calculating your personalized fitness plan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show success state
  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Profile Created Successfully!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Redirecting to your dashboard...
                </p>
              </div>
              {submitResult.tdeeCalculation && (
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p><strong>Your Daily Calories:</strong> {submitResult.tdeeCalculation.targetCalories}</p>
                  <p><strong>Protein:</strong> {submitResult.tdeeCalculation.macros.protein.grams}g</p>
                  <p><strong>Carbs:</strong> {submitResult.tdeeCalculation.macros.carbs.grams}g</p>
                  <p><strong>Fats:</strong> {submitResult.tdeeCalculation.macros.fats.grams}g</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (submitResult?.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              {submitResult.error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show onboarding flow
  return (
    <div>
      {initialProfile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 mx-4">
          <h3 className="font-medium text-blue-900 mb-1">Update Your Profile</h3>
          <p className="text-sm text-blue-700">
            You already have a fitness profile. You can update your information below or{' '}
            <button 
              onClick={() => router.push('/dashboard')}
              className="underline hover:no-underline"
            >
              return to dashboard
            </button>.
          </p>
        </div>
      )}
      
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        initialData={getInitialFormData()}
      />
    </div>
  )
}