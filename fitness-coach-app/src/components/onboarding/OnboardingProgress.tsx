"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle } from "lucide-react"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function OnboardingProgress({ currentStep, totalSteps, steps }: OnboardingProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="mb-4">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Step Circle */}
                <div className="flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle 
                      className={`w-6 h-6 ${
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      }`} 
                    />
                  )}
                </div>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`} 
                  />
                )}
              </div>
              
              {/* Step Label */}
              <span 
                className={`text-xs mt-2 text-center ${
                  isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}