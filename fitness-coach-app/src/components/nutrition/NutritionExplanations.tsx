"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Heart, Zap, Shield } from "lucide-react"

interface NutritionExplanationsProps {
  goal: "bulking" | "cutting" | "maintain"
}

export function NutritionExplanations({ goal }: NutritionExplanationsProps) {
  const getGoalSpecificTips = () => {
    switch (goal) {
      case "bulking":
        return {
          title: "Tips for Muscle Gain (Bulking)",
          tips: [
            "Eat more calories than you burn to fuel muscle growth",
            "Focus on protein-rich foods like chicken, fish, and beans",
            "Don't skip meals - eat regularly throughout the day",
            "Include healthy carbs like rice and sweet potato for energy",
            "Stay hydrated and get enough sleep for recovery"
          ],
          mealTiming: "Eat every 3-4 hours to keep your body fueled for muscle building"
        }
      case "cutting":
        return {
          title: "Tips for Fat Loss (Cutting)",
          tips: [
            "Eat fewer calories than you burn to lose fat",
            "Keep protein high to preserve muscle while losing weight",
            "Fill up on vegetables and lean proteins to stay full",
            "Choose complex carbs like brown rice over simple sugars",
            "Drink water before meals to help control portions"
          ],
          mealTiming: "Consider eating larger meals earlier in the day when you're more active"
        }
      case "maintain":
        return {
          title: "Tips for Weight Maintenance",
          tips: [
            "Balance your calories in with calories out",
            "Focus on nutrient-dense whole foods",
            "Listen to your hunger and fullness cues",
            "Maintain consistent eating patterns",
            "Allow flexibility for special occasions"
          ],
          mealTiming: "Eat when you're hungry and stop when you're satisfied"
        }
    }
  }

  const goalTips = getGoalSpecificTips()

  const filipinoMealPatterns = [
    {
      meal: "Almusal (Breakfast)",
      time: "6:00 - 8:00 AM",
      description: "Start your day with protein and carbs for energy",
      examples: "Tapsilog, champorado with tuyo, or oatmeal with banana"
    },
    {
      meal: "Tanghalian (Lunch)", 
      time: "12:00 - 1:00 PM",
      description: "Your biggest meal with balanced macros",
      examples: "Rice with ulam (meat/fish/vegetables), soup, and fruits"
    },
    {
      meal: "Merienda",
      time: "3:00 - 4:00 PM", 
      description: "Light snack to bridge lunch and dinner",
      examples: "Turon, halo-halo, or crackers with cheese"
    },
    {
      meal: "Hapunan (Dinner)",
      time: "6:00 - 8:00 PM",
      description: "Lighter meal, focus on protein and vegetables",
      examples: "Grilled fish with vegetables, or soup with rice"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Goal-Specific Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {goalTips.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {goalTips.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Meal Timing Tip:</h4>
            <p className="text-sm text-blue-800">{goalTips.mealTiming}</p>
          </div>
        </CardContent>
      </Card>

      {/* Filipino Meal Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Traditional Filipino Meal Pattern
          </CardTitle>
          <CardDescription>
            How to fit your macros into familiar Filipino eating habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filipinoMealPatterns.map((pattern, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{pattern.meal}</h4>
                  <Badge variant="outline" className="text-xs">{pattern.time}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Examples:</strong> {pattern.examples}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Basics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Energy Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Calories In:</strong> Food and drinks you consume</p>
              <p><strong>Calories Out:</strong> Energy your body uses</p>
              <div className="bg-yellow-50 p-3 rounded text-xs">
                <p className="font-medium">Simple Rule:</p>
                <p>Eat more = gain weight</p>
                <p>Eat less = lose weight</p>
                <p>Eat same = maintain weight</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Portion Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Protein:</strong> Palm-sized portion</p>
              <p><strong>Carbs:</strong> Cupped hand portion</p>
              <p><strong>Fats:</strong> Thumb-sized portion</p>
              <div className="bg-green-50 p-3 rounded text-xs">
                <p className="font-medium">Filipino Reference:</p>
                <p>1 cup rice = 1 fist</p>
                <p>1 piece chicken = 1 palm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Hydration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Daily Goal:</strong> 8-10 glasses of water</p>
              <p><strong>Before meals:</strong> 1 glass helps with portion control</p>
              <p><strong>During workouts:</strong> Sip regularly</p>
              <div className="bg-red-50 p-3 rounded text-xs">
                <p className="font-medium">Hot Climate Tip:</p>
                <p>Drink more water in Philippine heat and humidity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Filipino Food Swaps */}
      <Card>
        <CardHeader>
          <CardTitle>Healthier Filipino Food Swaps</CardTitle>
          <CardDescription>
            Simple changes to make your favorite foods more nutritious
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3 text-green-700">Better Choices</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Brown rice</span>
                  <span className="text-muted-foreground">instead of white rice</span>
                </div>
                <div className="flex justify-between">
                  <span>Grilled bangus</span>
                  <span className="text-muted-foreground">instead of fried</span>
                </div>
                <div className="flex justify-between">
                  <span>Fresh lumpia</span>
                  <span className="text-muted-foreground">instead of fried lumpia</span>
                </div>
                <div className="flex justify-between">
                  <span>Steamed siomai</span>
                  <span className="text-muted-foreground">instead of fried</span>
                </div>
                <div className="flex justify-between">
                  <span>Baked turon</span>
                  <span className="text-muted-foreground">instead of deep-fried</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 text-blue-700">Portion Tips</h4>
              <div className="space-y-2 text-sm">
                <div>• Use smaller plates for rice portions</div>
                <div>• Fill half your plate with vegetables</div>
                <div>• Choose lean cuts of meat</div>
                <div>• Limit fried foods to 1-2x per week</div>
                <div>• Drink water instead of sugary drinks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}