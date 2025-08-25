"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FitnessProfileFormData, fitnessProfileSchema } from "@/lib/validations/onboarding"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BODY_COMPOSITION_OPTIONS,
  FITNESS_GOALS,
  ACTIVITY_LEVELS,
  EQUIPMENT_OPTIONS,
  WORKOUT_FREQUENCY_OPTIONS,
} from "@/constants/onboarding"
import { useState } from "react"

interface FitnessProfileFormProps {
  onNext: (data: FitnessProfileFormData) => void
  onBack: () => void
  initialData?: Partial<FitnessProfileFormData>
}

export function FitnessProfileForm({ onNext, onBack, initialData }: FitnessProfileFormProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    initialData?.availableEquipment || []
  )

  const form = useForm<FitnessProfileFormData>({
    resolver: zodResolver(fitnessProfileSchema),
    defaultValues: {
      bodyComposition: initialData?.bodyComposition || undefined,
      goal: initialData?.goal || undefined,
      activityLevel: initialData?.activityLevel || undefined,
      workoutFrequency: initialData?.workoutFrequency || undefined,
      availableEquipment: selectedEquipment,
    },
  })

  const onSubmit = (data: FitnessProfileFormData) => {
    onNext(data)
  }

  const toggleEquipment = (equipmentValue: string) => {
    const newSelection = selectedEquipment.includes(equipmentValue)
      ? selectedEquipment.filter(item => item !== equipmentValue)
      : [...selectedEquipment, equipmentValue]
    
    setSelectedEquipment(newSelection)
    form.setValue("availableEquipment", newSelection)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Fitness Profile</CardTitle>
        <CardDescription>
          Help us understand your fitness background and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Body Composition Field */}
            <FormField
              control={form.control}
              name="bodyComposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Composition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your body type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BODY_COMPOSITION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the description that best matches your current body type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fitness Goal Field */}
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your primary goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FITNESS_GOALS.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{goal.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {goal.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your goal determines your calorie and workout recommendations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Level Field */}
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{level.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {level.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Consider your daily work and lifestyle activities
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workout Frequency Field */}
            <FormField
              control={form.control}
              name="workoutFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Frequency</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="How many days per week can you workout?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORKOUT_FREQUENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Be realistic about your schedule and commitments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Available Equipment Field */}
            <FormField
              control={form.control}
              name="availableEquipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Equipment</FormLabel>
                  <FormDescription className="mb-3">
                    Select all equipment you have access to (choose at least one)
                  </FormDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EQUIPMENT_OPTIONS.map((equipment) => (
                      <div
                        key={equipment.value}
                        onClick={() => toggleEquipment(equipment.value)}
                        className={`
                          p-3 border rounded-lg cursor-pointer transition-colors
                          ${selectedEquipment.includes(equipment.value)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{equipment.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {equipment.description}
                            </div>
                          </div>
                          {selectedEquipment.includes(equipment.value) && (
                            <Badge variant="secondary" className="ml-2">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Complete Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}