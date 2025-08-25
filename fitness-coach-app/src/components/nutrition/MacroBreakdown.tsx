"use client"

import { TDEECalculation } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface MacroBreakdownProps {
  macros: TDEECalculation["macros"]
  targetCalories: number
  showChart?: boolean
  showFilipinoExamples?: boolean
}

const MACRO_COLORS = {
  protein: "#22c55e", // green
  carbs: "#f97316",   // orange
  fats: "#a855f7"     // purple
}

export function MacroBreakdown({ 
  macros, 
  targetCalories, 
  showChart = true, 
  showFilipinoExamples = true 
}: MacroBreakdownProps) {
  
  const chartData = [
    {
      name: "Protein",
      value: macros.protein.calories,
      grams: macros.protein.grams,
      percentage: Math.round((macros.protein.calories / targetCalories) * 100)
    },
    {
      name: "Carbs",
      value: macros.carbs.calories,
      grams: macros.carbs.grams,
      percentage: Math.round((macros.carbs.calories / targetCalories) * 100)
    },
    {
      name: "Fats",
      value: macros.fats.calories,
      grams: macros.fats.grams,
      percentage: Math.round((macros.fats.calories / targetCalories) * 100)
    }
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{data.grams}g ({data.value} calories)</p>
          <p className="text-sm text-muted-foreground">{data.percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  const filipinoFoodExamples = {
    protein: [
      { food: "Adobong Manok", serving: "1 piece (100g)", protein: "25g" },
      { food: "Bangus", serving: "1 medium fillet", protein: "22g" },
      { food: "Itlog", serving: "1 large egg", protein: "6g" },
      { food: "Taho", serving: "1 cup", protein: "8g" },
      { food: "Tokwa", serving: "100g", protein: "15g" }
    ],
    carbs: [
      { food: "Kanin", serving: "1 cup cooked", carbs: "45g" },
      { food: "Tinapay", serving: "2 slices", carbs: "30g" },
      { food: "Saging", serving: "1 medium", carbs: "27g" },
      { food: "Kamote", serving: "1 medium", carbs: "23g" },
      { food: "Pasta", serving: "1 cup cooked", carbs: "40g" }
    ],
    fats: [
      { food: "Cooking Oil", serving: "1 tbsp", fats: "14g" },
      { food: "Peanuts", serving: "1 oz (28g)", fats: "14g" },
      { food: "Coconut Milk", serving: "1/4 cup", fats: "12g" },
      { food: "Avocado", serving: "1/2 medium", fats: "15g" },
      { food: "Mayonnaise", serving: "1 tbsp", fats: "11g" }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Chart Visualization */}
      {showChart && (
        <Card>
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
            <CardDescription>
              Visual breakdown of your daily macronutrients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={MACRO_COLORS[entry.name.toLowerCase() as keyof typeof MACRO_COLORS]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color }}>
                        {value}: {entry.payload?.grams}g ({entry.payload?.percentage}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Protein Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              Protein
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{macros.protein.grams}g</div>
              <div className="text-sm text-muted-foreground">{macros.protein.calories} calories</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((macros.protein.calories / targetCalories) * 100)}% of total
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Why it matters:</p>
              <p>Builds and repairs muscles, helps you feel full, and supports recovery after workouts.</p>
            </div>
          </CardContent>
        </Card>

        {/* Carbs Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              Carbohydrates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{macros.carbs.grams}g</div>
              <div className="text-sm text-muted-foreground">{macros.carbs.calories} calories</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((macros.carbs.calories / targetCalories) * 100)}% of total
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Why it matters:</p>
              <p>Your body's main fuel source for energy, especially important for workouts and brain function.</p>
            </div>
          </CardContent>
        </Card>

        {/* Fats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              Fats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{macros.fats.grams}g</div>
              <div className="text-sm text-muted-foreground">{macros.fats.calories} calories</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((macros.fats.calories / targetCalories) * 100)}% of total
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Why it matters:</p>
              <p>Essential for hormone production, vitamin absorption, and keeping you satisfied after meals.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filipino Food Examples */}
      {showFilipinoExamples && (
        <Card>
          <CardHeader>
            <CardTitle>Filipino Food Examples</CardTitle>
            <CardDescription>
              Common Filipino foods and their macro content to help you plan your meals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Protein Foods */}
              <div>
                <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Protein-Rich Foods
                </h4>
                <div className="space-y-2">
                  {filipinoFoodExamples.protein.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{item.food}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.serving} = {item.protein} protein
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carb Foods */}
              <div>
                <h4 className="font-medium text-orange-700 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  Carb-Rich Foods
                </h4>
                <div className="space-y-2">
                  {filipinoFoodExamples.carbs.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{item.food}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.serving} = {item.carbs} carbs
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fat Foods */}
              <div>
                <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  Healthy Fats
                </h4>
                <div className="space-y-2">
                  {filipinoFoodExamples.fats.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{item.food}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.serving} = {item.fats} fats
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}