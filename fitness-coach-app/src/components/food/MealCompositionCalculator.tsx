'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Calculator, DollarSign } from 'lucide-react';
import { FoodItem } from '@/types';
import { mealCalculator, MealFoodItem } from '@/utils/meal-calculator';
import { FoodSearch } from './FoodSearch';
import { PortionHelper } from './PortionHelper';

interface MealCompositionCalculatorProps {
  initialFoods?: MealFoodItem[];
  onMealCalculated?: (composition: any) => void;
  mealType?: 'breakfast' | 'lunch' | 'merienda' | 'dinner';
}

export function MealCompositionCalculator({ 
  initialFoods = [], 
  onMealCalculated,
  mealType 
}: MealCompositionCalculatorProps) {
  const [selectedFoods, setSelectedFoods] = useState<MealFoodItem[]>(initialFoods);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedFoodForPortion, setSelectedFoodForPortion] = useState<FoodItem | null>(null);
  const [mealComposition, setMealComposition] = useState<any>(null);

  const addFood = (food: FoodItem) => {
    const mealFood: MealFoodItem = {
      ...food,
      quantity: 1,
      unit: food.servingSize,
    };
    setSelectedFoods(prev => [...prev, mealFood]);
    setShowFoodSearch(false);
  };

  const removeFood = (index: number) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const updateFoodPortion = (index: number, quantity: number, unit: string) => {
    setSelectedFoods(prev => prev.map((food, i) => 
      i === index ? { ...food, quantity, unit } : food
    ));
  };

  const calculateMeal = () => {
    if (selectedFoods.length === 0) return;

    const composition = mealCalculator.calculateMealComposition(selectedFoods);
    setMealComposition(composition);
    onMealCalculated?.(composition);
  };

  const getMealTypeLabel = () => {
    const labels = {
      breakfast: 'Almusal (Breakfast)',
      lunch: 'Tanghalian (Lunch)',
      merienda: 'Merienda',
      dinner: 'Hapunan (Dinner)',
    };
    return mealType ? labels[mealType] : 'Meal';
  };

  const getMacroPercentage = (macro: number, totalCalories: number, caloriesPerGram: number) => {
    if (totalCalories === 0) return 0;
    return Math.round((macro * caloriesPerGram / totalCalories) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {getMealTypeLabel()} Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Add Filipino foods to calculate the total nutrition and cost for your meal.
          </p>
        </CardContent>
      </Card>

      {/* Selected Foods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Selected Foods</CardTitle>
            <Button 
              onClick={() => setShowFoodSearch(true)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedFoods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No foods selected yet.</p>
              <p className="text-sm mt-1">Click "Add Food" to start building your meal.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedFoods.map((food, index) => (
                <div key={`${food.id}-${index}`} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{food.name}</h4>
                      {food.nameFilipino && (
                        <p className="text-sm text-gray-600">{food.nameFilipino}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFood(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Current portion:</p>
                      <p className="text-sm text-gray-600">
                        {food.quantity} {food.unit}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFoodForPortion(food)}
                      >
                        Adjust Portion
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calculate Button */}
      {selectedFoods.length > 0 && (
        <div className="text-center">
          <Button onClick={calculateMeal} size="lg">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Meal Nutrition
          </Button>
        </div>
      )}

      {/* Meal Composition Results */}
      {mealComposition && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">
              Meal Nutrition Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Calories */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {mealComposition.totalCalories}
              </div>
              <div className="text-sm text-gray-600">Total Calories</div>
            </div>

            <Separator />

            {/* Macronutrients */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-semibold text-red-600">
                  {mealComposition.totalMacros.protein}g
                </div>
                <div className="text-sm text-gray-600">Protein</div>
                <div className="text-xs text-gray-500">
                  {getMacroPercentage(mealComposition.totalMacros.protein, mealComposition.totalCalories, 4)}%
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold text-yellow-600">
                  {mealComposition.totalMacros.carbs}g
                </div>
                <div className="text-sm text-gray-600">Carbs</div>
                <div className="text-xs text-gray-500">
                  {getMacroPercentage(mealComposition.totalMacros.carbs, mealComposition.totalCalories, 4)}%
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold text-purple-600">
                  {mealComposition.totalMacros.fats}g
                </div>
                <div className="text-sm text-gray-600">Fats</div>
                <div className="text-xs text-gray-500">
                  {getMacroPercentage(mealComposition.totalMacros.fats, mealComposition.totalCalories, 9)}%
                </div>
              </div>
            </div>

            {/* Macro Bar */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Macro Distribution</div>
              <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
                <div 
                  className="bg-red-400" 
                  style={{ 
                    width: `${getMacroPercentage(mealComposition.totalMacros.protein, mealComposition.totalCalories, 4)}%` 
                  }}
                />
                <div 
                  className="bg-yellow-400" 
                  style={{ 
                    width: `${getMacroPercentage(mealComposition.totalMacros.carbs, mealComposition.totalCalories, 4)}%` 
                  }}
                />
                <div 
                  className="bg-purple-400" 
                  style={{ 
                    width: `${getMacroPercentage(mealComposition.totalMacros.fats, mealComposition.totalCalories, 9)}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Protein</span>
                <span>Carbs</span>
                <span>Fats</span>
              </div>
            </div>

            {/* Cost */}
            {mealComposition.estimatedCost > 0 && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Cost:</span>
                  <Badge variant="outline" className="text-green-600">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ₱{mealComposition.estimatedCost.toFixed(2)}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Food Search Modal */}
      {showFoodSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add Food to Meal</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowFoodSearch(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <FoodSearch
                onFoodSelect={addFood}
                selectedFoods={selectedFoods}
                showSelection={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Portion Helper Modal */}
      {selectedFoodForPortion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Adjust Portion Size</h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFoodForPortion(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <PortionHelper
                food={selectedFoodForPortion}
                onPortionCalculated={(quantity, unit) => {
                  const index = selectedFoods.findIndex(f => f.id === selectedFoodForPortion.id);
                  if (index !== -1) {
                    updateFoodPortion(index, quantity, unit);
                  }
                  setSelectedFoodForPortion(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}