'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Utensils, 
  DollarSign, 
  Target,
  Edit,
  Calendar,
  ChefHat,
  Info
} from 'lucide-react';
import { MealPlan, Meal } from '@/types';
import { MealCustomizer } from './MealCustomizer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  onMealPlanUpdated: (updatedMealPlan: MealPlan) => void;
  showCustomization?: boolean;
  targetCalories?: number;
  targetMacros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealTimes?: Record<'breakfast' | 'lunch' | 'merienda' | 'dinner', string>;
}

export function MealPlanDisplay({ 
  mealPlan, 
  onMealPlanUpdated, 
  showCustomization = true,
  targetCalories,
  targetMacros,
  mealTimes
}: MealPlanDisplayProps) {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [customizationOpen, setCustomizationOpen] = useState(false);

  const mealTypes = [
    { 
      key: 'breakfast', 
      label: 'Almusal (Breakfast)', 
      icon: '🌅', 
      time: mealTimes?.breakfast ?? '6:00-8:00 AM',
      description: 'Start your day with energy-boosting foods',
      culturalNotes: 'Filipinos often eat rice for breakfast with fried eggs and meat',
      color: 'bg-yellow-50 border-yellow-200'
    },
    { 
      key: 'lunch', 
      label: 'Tanghalian (Lunch)', 
      icon: '☀️', 
      time: mealTimes?.lunch ?? '12:00-1:00 PM',
      description: 'Main meal with balanced nutrition',
      culturalNotes: 'Lunch is the biggest meal, typically with rice and a protein-rich ulam',
      color: 'bg-orange-50 border-orange-200'
    },
    { 
      key: 'merienda', 
      label: 'Merienda', 
      icon: '🍰', 
      time: mealTimes?.merienda ?? '3:00-4:00 PM',
      description: 'Light snack to bridge meals',
      culturalNotes: 'Merienda bridges lunch and dinner, often includes local delicacies',
      color: 'bg-pink-50 border-pink-200'
    },
    { 
      key: 'dinner', 
      label: 'Hapunan (Dinner)', 
      icon: '🌙', 
      time: mealTimes?.dinner ?? '6:00-8:00 PM',
      description: 'Evening meal for recovery and rest',
      culturalNotes: 'Dinner often includes sabaw (soup) and is eaten with family',
      color: 'bg-blue-50 border-blue-200'
    },
  ];

  const handleMealUpdated = (updatedMeal: Meal) => {
    const updatedMeals = mealPlan.meals.map(meal => 
      meal.type === updatedMeal.type ? updatedMeal : meal
    );

    const updatedMealPlan = {
      ...mealPlan,
      meals: updatedMeals,
      totalCalories: updatedMeals.reduce((sum, meal) => sum + meal.calories, 0),
      totalMacros: updatedMeals.reduce(
        (sum, meal) => ({
          protein: sum.protein + meal.macros.protein,
          carbs: sum.carbs + meal.macros.carbs,
          fats: sum.fats + meal.macros.fats,
        }),
        { protein: 0, carbs: 0, fats: 0 }
      ),
    };

    onMealPlanUpdated(updatedMealPlan);
    setCustomizationOpen(false);
  };

  const getTotalCost = () => {
    return mealPlan.meals.reduce((total, meal) => {
      return total + meal.foods.reduce((mealTotal, food) => {
        return mealTotal + (food.estimatedCost || 0);
      }, 0);
    }, 0);
  };

  const getCalorieProgress = () => {
    if (!targetCalories) return 0;
    return (mealPlan.totalCalories / targetCalories) * 100;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-PH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              <span>Daily Meal Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(mealPlan.date)}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Daily Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {mealPlan.totalCalories}
              </div>
              <div className="text-sm text-gray-600">Total Calories</div>
              {targetCalories && (
                <div className="text-xs text-gray-500">
                  {getCalorieProgress().toFixed(0)}% of target
                </div>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {mealPlan.totalMacros.protein.toFixed(1)}g
              </div>
              <div className="text-sm text-gray-600">Protein</div>
              {targetMacros && (
                <div className="text-xs text-gray-500">
                  Target: {targetMacros.protein.toFixed(1)}g
                </div>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {mealPlan.totalMacros.carbs.toFixed(1)}g
              </div>
              <div className="text-sm text-gray-600">Carbs</div>
              {targetMacros && (
                <div className="text-xs text-gray-500">
                  Target: {targetMacros.carbs.toFixed(1)}g
                </div>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {mealPlan.totalMacros.fats.toFixed(1)}g
              </div>
              <div className="text-sm text-gray-600">Fats</div>
              {targetMacros && (
                <div className="text-xs text-gray-500">
                  Target: {targetMacros.fats.toFixed(1)}g
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {targetCalories && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Calorie Progress</span>
                <span>{getCalorieProgress().toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(getCalorieProgress(), 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cost Summary */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated Daily Cost:</span>
              <Badge variant="outline">
                <DollarSign className="h-3 w-3 mr-1" />
                ₱{getTotalCost().toFixed(2)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealTypes.map((mealType) => {
          const meal = mealPlan.meals.find(m => m.type === mealType.key);
          if (!meal) return null;

          return (
            <Card key={mealType.key} className={mealType.color}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mealType.icon}</span>
                    <div>
                      <div className="text-base">{mealType.label}</div>
                      <div className="text-xs text-gray-500 font-normal flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mealType.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {meal.calories} cal
                    </Badge>
                    {showCustomization && (
                      <Dialog open={customizationOpen} onOpenChange={setCustomizationOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedMeal(meal)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Customize {mealType.label}</DialogTitle>
                          </DialogHeader>
                          {selectedMeal && (
                            <MealCustomizer
                              meal={selectedMeal}
                              onMealUpdated={handleMealUpdated}
                              targetCalories={targetCalories ? targetCalories * (mealType.key === 'breakfast' ? 0.25 : mealType.key === 'lunch' ? 0.35 : mealType.key === 'merienda' ? 0.15 : 0.25) : undefined}
                              targetMacros={targetMacros ? {
                                protein: targetMacros.protein * (mealType.key === 'breakfast' ? 0.25 : mealType.key === 'lunch' ? 0.35 : mealType.key === 'merienda' ? 0.15 : 0.25),
                                carbs: targetMacros.carbs * (mealType.key === 'breakfast' ? 0.25 : mealType.key === 'lunch' ? 0.35 : mealType.key === 'merienda' ? 0.15 : 0.25),
                                fats: targetMacros.fats * (mealType.key === 'breakfast' ? 0.25 : mealType.key === 'lunch' ? 0.35 : mealType.key === 'merienda' ? 0.15 : 0.25),
                              } : undefined}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Meal Description */}
                <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-600">
                    <p>{mealType.description}</p>
                    <p className="mt-1 text-gray-500 italic">{mealType.culturalNotes}</p>
                  </div>
                </div>

                {/* Food Items */}
                <div className="space-y-3">
                  {meal.foods.map((food, index) => (
                    <div key={`${food.id}-${index}`} className="bg-white/70 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{food.name}</div>
                          {food.nameFilipino && (
                            <div className="text-xs text-gray-500 italic">
                              {food.nameFilipino}
                            </div>
                          )}
                          <div className="text-xs text-gray-600 mt-1">
                            {food.servingSize}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{food.calories} cal</div>
                          {food.estimatedCost && (
                            <div className="text-xs text-green-600">
                              ₱{food.estimatedCost.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>P: {food.macros.protein.toFixed(1)}g</span>
                        <span>C: {food.macros.carbs.toFixed(1)}g</span>
                        <span>F: {food.macros.fats.toFixed(1)}g</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Meal Totals */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="font-medium text-blue-600">{meal.calories}</div>
                    <div className="text-gray-500">Cal</div>
                  </div>
                  <div>
                    <div className="font-medium text-green-600">{meal.macros.protein.toFixed(1)}g</div>
                    <div className="text-gray-500">Protein</div>
                  </div>
                  <div>
                    <div className="font-medium text-orange-600">{meal.macros.carbs.toFixed(1)}g</div>
                    <div className="text-gray-500">Carbs</div>
                  </div>
                  <div>
                    <div className="font-medium text-purple-600">{meal.macros.fats.toFixed(1)}g</div>
                    <div className="text-gray-500">Fats</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}