'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Replace, 
  Search, 
  Plus, 
  Minus, 
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Meal, FoodItem } from '@/types';
import { foodSearchService } from '@/lib/food-search';
import { mealCalculator } from '@/utils/meal-calculator';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MealCustomizerProps {
  meal: Meal;
  onMealUpdated: (updatedMeal: Meal) => void;
  targetCalories?: number;
  targetMacros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

interface FoodSubstitution {
  originalFood: FoodItem;
  newFood: FoodItem;
  quantity: number;
  unit: string;
}

export function MealCustomizer({ 
  meal, 
  onMealUpdated, 
  targetCalories,
  targetMacros 
}: MealCustomizerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [substitutionDialogOpen, setSubstitutionDialogOpen] = useState(false);
  const [customizedMeal, setCustomizedMeal] = useState<Meal>(meal);

  useEffect(() => {
    setCustomizedMeal(meal);
  }, [meal]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await foodSearchService.searchFoods(query, {
        commonInPhilippines: true,
      });
      setSearchResults(results.foods);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFoodSubstitution = (originalFood: FoodItem, newFood: FoodItem) => {
    const updatedFoods = customizedMeal.foods.map(food => 
      food.id === originalFood.id ? newFood : food
    );

    const updatedMeal = {
      ...customizedMeal,
      foods: updatedFoods,
      calories: updatedFoods.reduce((sum, food) => sum + food.calories, 0),
      macros: updatedFoods.reduce(
        (sum, food) => ({
          protein: sum.protein + food.macros.protein,
          carbs: sum.carbs + food.macros.carbs,
          fats: sum.fats + food.macros.fats,
        }),
        { protein: 0, carbs: 0, fats: 0 }
      ),
    };

    setCustomizedMeal(updatedMeal);
    onMealUpdated(updatedMeal);
    setSubstitutionDialogOpen(false);
  };

  const handleAddFood = (food: FoodItem) => {
    const updatedFoods = [...customizedMeal.foods, food];
    
    const updatedMeal = {
      ...customizedMeal,
      foods: updatedFoods,
      calories: updatedFoods.reduce((sum, food) => sum + food.calories, 0),
      macros: updatedFoods.reduce(
        (sum, food) => ({
          protein: sum.protein + food.macros.protein,
          carbs: sum.carbs + food.macros.carbs,
          fats: sum.fats + food.macros.fats,
        }),
        { protein: 0, carbs: 0, fats: 0 }
      ),
    };

    setCustomizedMeal(updatedMeal);
    onMealUpdated(updatedMeal);
  };

  const handleRemoveFood = (foodId: string) => {
    const updatedFoods = customizedMeal.foods.filter(food => food.id !== foodId);
    
    const updatedMeal = {
      ...customizedMeal,
      foods: updatedFoods,
      calories: updatedFoods.reduce((sum, food) => sum + food.calories, 0),
      macros: updatedFoods.reduce(
        (sum, food) => ({
          protein: sum.protein + food.macros.protein,
          carbs: sum.carbs + food.macros.carbs,
          fats: sum.fats + food.macros.fats,
        }),
        { protein: 0, carbs: 0, fats: 0 }
      ),
    };

    setCustomizedMeal(updatedMeal);
    onMealUpdated(updatedMeal);
  };

  const getCalorieVariance = () => {
    if (!targetCalories) return null;
    const variance = ((customizedMeal.calories - targetCalories) / targetCalories) * 100;
    return variance;
  };

  const getMacroVariance = (macro: 'protein' | 'carbs' | 'fats') => {
    if (!targetMacros) return null;
    const target = targetMacros[macro];
    const actual = customizedMeal.macros[macro];
    return ((actual - target) / target) * 100;
  };

  const calorieVariance = getCalorieVariance();

  return (
    <div className="space-y-4">
      {/* Meal Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customize {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</span>
            <div className="flex items-center gap-2">
              {calorieVariance !== null && (
                <Badge 
                  variant={Math.abs(calorieVariance) > 15 ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {calorieVariance > 0 ? '+' : ''}{calorieVariance.toFixed(0)}% cal
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Foods */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Current Foods:</Label>
            {customizedMeal.foods.map((food, index) => (
              <div key={`${food.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{food.name}</div>
                  <div className="text-xs text-gray-500">
                    {food.servingSize} • {food.calories} cal • 
                    P: {food.macros.protein}g, C: {food.macros.carbs}g, F: {food.macros.fats}g
                  </div>
                  {food.estimatedCost && (
                    <div className="text-xs text-green-600">₱{food.estimatedCost.toFixed(2)}</div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedFood(food)}>
                        <Replace className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Replace {food.name}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search for replacement food..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              handleSearch(e.target.value);
                            }}
                          />
                          <Button variant="outline" disabled={isSearching}>
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {searchResults.map((result) => (
                            <div 
                              key={result.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleFoodSubstitution(food, result)}
                            >
                              <div>
                                <div className="font-medium text-sm">{result.name}</div>
                                <div className="text-xs text-gray-500">
                                  {result.servingSize} • {result.calories} cal
                                </div>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleRemoveFood(food.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Add New Food */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add Food:</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Search Filipino foods to add..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              <Button variant="outline" disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
                {searchResults.slice(0, 5).map((result) => (
                  <div 
                    key={result.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleAddFood(result)}
                  >
                    <div>
                      <div className="font-medium text-sm">{result.name}</div>
                      <div className="text-xs text-gray-500">
                        {result.calories} cal • {result.category}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Nutrition Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {customizedMeal.calories}
              </div>
              <div className="text-xs text-gray-600">Calories</div>
              {targetCalories && (
                <div className="text-xs text-gray-500">
                  Target: {targetCalories}
                </div>
              )}
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {customizedMeal.macros.protein.toFixed(1)}g
              </div>
              <div className="text-xs text-gray-600">Protein</div>
              {targetMacros && (
                <div className="text-xs text-gray-500">
                  Target: {targetMacros.protein.toFixed(1)}g
                </div>
              )}
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {customizedMeal.macros.carbs.toFixed(1)}g
              </div>
              <div className="text-xs text-gray-600">Carbs</div>
              {targetMacros && (
                <div className="text-xs text-gray-500">
                  Target: {targetMacros.carbs.toFixed(1)}g
                </div>
              )}
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {customizedMeal.macros.fats.toFixed(1)}g
              </div>
              <div className="text-xs text-gray-600">Fats</div>
              {targetMacros && (
                <div className="text-xs text-gray-500">
                  Target: {targetMacros.fats.toFixed(1)}g
                </div>
              )}
            </div>
          </div>

          {/* Warnings */}
          {calorieVariance !== null && Math.abs(calorieVariance) > 20 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Calorie variance is {Math.abs(calorieVariance).toFixed(0)}% from target
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Consider adjusting portion sizes or substituting foods to better match your goals.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}