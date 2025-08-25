"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PersonalInfoFormData, personalInfoSchema } from "@/lib/validations/onboarding"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/contexts/LocaleContext"
import { feetDecimalToCm, cmToFeetDecimal, kgToLb, lbToKg } from "@/utils/units"

interface PersonalInfoFormProps {
  onNext: (data: PersonalInfoFormData) => void
  initialData?: Partial<PersonalInfoFormData>
}

export function PersonalInfoForm({ onNext, initialData }: PersonalInfoFormProps) {
  const { unitSystem } = useLocale()
  const defaultHeightUnit: "cm" | "ft-in" = initialData?.height?.unit || (unitSystem === "imperial" ? "ft-in" : "cm")
  const defaultWeightUnit: "kg" | "lbs" = initialData?.weight?.unit || (unitSystem === "imperial" ? "lbs" : "kg")
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft-in">(defaultHeightUnit)
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(defaultWeightUnit)

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      age: initialData?.age || undefined,
      gender: initialData?.gender || undefined,
      height: {
        value: initialData?.height?.value || undefined,
        unit: heightUnit,
      },
      weight: {
        value: initialData?.weight?.value || undefined,
        unit: weightUnit,
      },
    },
  })

  const onSubmit = (data: PersonalInfoFormData) => {
    // Normalize to cm/kg before forwarding
    const heightCm = data.height.unit === "cm" ? data.height.value : feetDecimalToCm(data.height.value)
    const weightKg = data.weight.unit === "kg" ? data.weight.value : lbToKg(data.weight.value)

    const normalized: PersonalInfoFormData = {
      ...data,
      height: { value: Math.round(heightCm), unit: "cm" },
      weight: { value: Math.round(weightKg), unit: "kg" },
    }
    onNext(normalized)
  }

  // Convert height display for ft-in format
  const formatHeightPlaceholder = () => {
    if (heightUnit === "ft-in") {
      return "e.g., 5.6 (5 feet 6 inches)"
    }
    return "e.g., 170"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Tell us about yourself so we can create a personalized fitness plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Age Field */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    We use your age to calculate accurate calorie needs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Gender affects metabolism and calorie calculations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Height Field */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder={formatHeightPlaceholder()}
                        value={field.value?.value || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || undefined
                          field.onChange({
                            value,
                            unit: heightUnit,
                          })
                        }}
                        className="flex-1"
                      />
                    </FormControl>
                    <Select
                      value={heightUnit}
                      onValueChange={(value: "cm" | "ft-in") => {
                        const prev = field.value
                        let newValue: number | undefined = prev?.value
                        if (typeof prev?.value === "number") {
                          if (value === "ft-in") {
                            const cmVal = prev.unit === "cm" ? prev.value : feetDecimalToCm(prev.value)
                            const ftDec = cmToFeetDecimal(cmVal)
                            newValue = isNaN(ftDec) ? undefined : Math.round(ftDec * 10) / 10
                          } else {
                            // to cm
                            const cmVal = prev.unit === "cm" ? prev.value : feetDecimalToCm(prev.value)
                            newValue = Math.round(cmVal)
                          }
                        }
                        setHeightUnit(value)
                        field.onChange({ value: newValue, unit: value })
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="ft-in">ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription>
                    {heightUnit === "ft-in"
                      ? "Enter as decimal (e.g., 5.6 for 5 feet 6 inches)"
                      : "Enter your height in centimeters"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight Field */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder={weightUnit === "kg" ? "e.g., 70" : "e.g., 154"}
                        value={field.value?.value || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || undefined
                          field.onChange({
                            value,
                            unit: weightUnit,
                          })
                        }}
                        className="flex-1"
                      />
                    </FormControl>
                    <Select
                      value={weightUnit}
                      onValueChange={(value: "kg" | "lbs") => {
                        const prev = field.value
                        let newValue: number | undefined = prev?.value
                        if (typeof prev?.value === "number") {
                          if (value === "lbs") {
                            const kg = prev.unit === "kg" ? prev.value : lbToKg(prev.value)
                            newValue = Math.round(kgToLb(kg))
                          } else {
                            // to kg
                            const kg = prev.unit === "kg" ? prev.value : lbToKg(prev.value)
                            newValue = Math.round(kg)
                          }
                        }
                        setWeightUnit(value)
                        field.onChange({ value: newValue, unit: value })
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription>
                    Your current weight helps us calculate your daily calorie needs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Continue to Fitness Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}