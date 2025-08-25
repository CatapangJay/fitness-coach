"use client"

import { TDEECalculation } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Info, Target, Activity, Utensils } from "lucide-react"

interface TDEEResultsProps {
  calculation: TDEECalculation
  goal: "bulking" | "cutting" | "maintain"
  showExplanations?: boolean
}

export function TDEEResults({ calculation, goal, showExplanations = true }: TDEEResultsProps) {
  const { bmr, tdee, targetCalories, macros } = calculation

  const getGoalInfo = () => {
    switch (goal) {
      case "bulking":
        return {
          label: "Muscle Gain (Bulking)",
          description: "Eating more calories to build muscle and strength",
          color: "bg-green-500",
          icon: "💪"
        }
      case "cutting":
        return {
          label: "Fat Loss (Cutting)", 
          description: "Eating fewer calories to lose fat while keeping muscle",
          color: "bg-red-500",
          icon: "🔥"
        }
      case "maintain":
        return {
          label: "Maintain Weight",
          description: "Eating the right amount to stay at your current weight",
          color: "bg-blue-500",
          icon: "⚖️"
        }
    }
  }

  const goalInfo = getGoalInfo()

  return (
    <div className="space-y-6">
      {/* Goal Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Fitness Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{goalInfo.icon}</div>
            <div>
              <h3 className="font-semibold">{goalInfo.label}</h3>
              <p className="text-sm text-muted-foreground">{goalInfo.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Calorie Target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Your Daily Calorie Target
          </CardTitle>
          <CardDescription>
            This is how many calories you should eat each day to reach your goal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {targetCalories.toLocaleString()}
            </div>
            <div className="text-lg text-muted-foreground mb-4">calories per day</div>
            
            {showExplanations && (
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900 mb-1">What this means:</p>
                    <p className="text-blue-800">
                      This number includes all the food you eat in a day - your breakfast, lunch, 
                      merienda, dinner, and any snacks. It's calculated based on your body size, 
                      activity level, and fitness goal.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Macronutrient Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Macronutrients (Macros)</CardTitle>
          <CardDescription>
            How to split your calories between protein, carbs, and fats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Protein */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-green-700">Protein</span>
              <span className="text-sm font-mono">
                {macros.protein.grams}g ({macros.protein.calories} cal)
              </span>
            </div>
            <Progress 
              value={(macros.protein.calories / targetCalories) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Builds and repairs muscles. Found in meat, fish, eggs, beans, and dairy.
            </p>
          </div>

          {/* Carbohydrates */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-700">Carbohydrates</span>
              <span className="text-sm font-mono">
                {macros.carbs.grams}g ({macros.carbs.calories} cal)
              </span>
            </div>
            <Progress 
              value={(macros.carbs.calories / targetCalories) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Your body's main energy source. Found in rice, bread, fruits, and vegetables.
            </p>
          </div>

          {/* Fats */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-700">Fats</span>
              <span className="text-sm font-mono">
                {macros.fats.grams}g ({macros.fats.calories} cal)
              </span>
            </div>
            <Progress 
              value={(macros.fats.calories / targetCalories) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Important for hormones and vitamin absorption. Found in oils, nuts, and avocado.
            </p>
          </div>

          {showExplanations && (
            <div className="bg-yellow-50 p-4 rounded-lg text-sm mt-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-yellow-900 mb-1">Filipino Food Examples:</p>
                  <ul className="text-yellow-800 space-y-1">
                    <li><strong>Protein:</strong> Adobong manok, bangus, itlog, taho, gatas</li>
                    <li><strong>Carbs:</strong> Kanin, tinapay, saging, kamote, pasta</li>
                    <li><strong>Fats:</strong> Cooking oil, nuts, coconut milk, avocado</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metabolism Breakdown */}
      {showExplanations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              How We Calculated This
            </CardTitle>
            <CardDescription>
              Understanding your metabolism and daily calorie needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Base Metabolism (BMR)</span>
                  <span className="text-sm font-mono">{bmr} cal</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Calories your body burns just to stay alive (breathing, heart beating, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Daily Energy (TDEE)</span>
                  <span className="text-sm font-mono">{tdee} cal</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  BMR + calories burned from daily activities and exercise
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">The Math:</h4>
              <div className="text-sm space-y-1">
                <div>1. Base metabolism: <span className="font-mono">{bmr} calories</span></div>
                <div>2. + Daily activities: <span className="font-mono">{tdee - bmr} calories</span></div>
                <div>3. = Total daily burn: <span className="font-mono">{tdee} calories</span></div>
                <div>4. {goal === 'bulking' ? '+ Surplus for muscle gain' : goal === 'cutting' ? '- Deficit for fat loss' : '= Maintenance'}: <span className="font-mono">{targetCalories - tdee > 0 ? '+' : ''}{targetCalories - tdee} calories</span></div>
                <div className="font-medium pt-1 border-t">
                  = Your target: <span className="font-mono">{targetCalories} calories</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}