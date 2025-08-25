"use client"

import { useState } from "react"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { FitnessProfileForm } from "./FitnessProfileForm"
import { OnboardingProgress } from "./OnboardingProgress"
import { PersonalInfoFormData, FitnessProfileFormData, OnboardingFormData } from "@/lib/validations/onboarding"

interface OnboardingFlowProps {
  onComplete: (data: OnboardingFormData) => void
  initialData?: Partial<OnboardingFormData>
}

const STEPS = ["Personal Info", "Fitness Profile"]

export function OnboardingFlow({ onComplete, initialData }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({
    personalInfo: initialData?.personalInfo,
    fitnessProfile: initialData?.fitnessProfile,
  })

  const handlePersonalInfoNext = (data: PersonalInfoFormData) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: data,
    }))
    setCurrentStep(2)
  }

  const handleFitnessProfileNext = (data: FitnessProfileFormData) => {
    const completeData: OnboardingFormData = {
      personalInfo: formData.personalInfo!,
      fitnessProfile: data,
    }
    
    setFormData(prev => ({
      ...prev,
      fitnessProfile: data,
    }))
    
    onComplete(completeData)
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        <OnboardingProgress 
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />

        {currentStep === 1 && (
          <PersonalInfoForm
            onNext={handlePersonalInfoNext}
            initialData={formData.personalInfo}
          />
        )}

        {currentStep === 2 && (
          <FitnessProfileForm
            onNext={handleFitnessProfileNext}
            onBack={handleBack}
            initialData={formData.fitnessProfile}
          />
        )}
      </div>
    </div>
  )
}