'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  RefreshCw, 
  Save, 
  Clock, 
  Target, 
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { MealPlan, UserProfile } from '@/types';
import { mealPlanGenerator, MealSuggestion } from '@/lib/meal-plan-generator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocale } from '@/contexts/LocaleContext';
import { formatCurrency } from '@/utils/format';

interface MealPlanGeneratorProps {
  profile: UserProfile;
  onMealPlanGenerated: (mealPlan: MealPlan) => void;
  currentDate?: Date;
  workSchedule?: 'day' | 'night' | 'flex';
  climate?: 'hot' | 'rainy' | 'cool';
}

export function MealPlanGenerator({ 
  profile, 
  onMealPlanGenerated, 
  currentDate = new Date(),
  workSchedule = 'day',
  climate = 'hot',
}: MealPlanGeneratorProps) {
  const { language, locale, currency } = useLocale();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  const [suggestions, setSuggestions] = useState<{ [key: string]: MealSuggestion[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mealTimes = mealPlanGenerator.getRecommendedMealTimes(workSchedule, currentDate);
  const mealTypes = [
    { key: 'breakfast', label: 'Almusal (Breakfast)', icon: '🌅', time: mealTimes.breakfast },
    { key: 'lunch', label: 'Tanghalian (Lunch)', icon: '☀️', time: mealTimes.lunch },
    { key: 'merienda', label: 'Merienda', icon: '🍰', time: mealTimes.merienda },
    { key: 'dinner', label: 'Hapunan (Dinner)', icon: '🌙', time: mealTimes.dinner },
  ];

  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const mealPlan = await mealPlanGenerator.generateMealPlan(
        profile.userId,
        profile,
        currentDate,
        { language, culturalContext: { workSchedule, climate } }
      );

      setGeneratedPlan(mealPlan);
      onMealPlanGenerated(mealPlan);
      setSuccess('Meal plan generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSuggestions = async (mealType: string) => {
    try {
      const mealSuggestions = await mealPlanGenerator.generateMealSuggestions(
        mealType as any,
        {
          targetCalories: profile.targetCalories || 2000,
          targetMacros: {
            protein: profile.proteinGrams || 150,
            carbs: profile.carbsGrams || 200,
            fats: profile.fatsGrams || 65,
          },
          goal: profile.goal,
          language,
          culturalContext: { workSchedule, climate },
        }
      );

      setSuggestions(prev => ({
        ...prev,
        [mealType]: mealSuggestions,
      }));
    } catch (err) {
      setError(`Failed to generate suggestions for ${mealType}`);
    }
  };

  const handleSaveMealPlan = async () => {
    if (!generatedPlan) return;

    setIsSaving(true);
    setError(null);

    try {
      await mealPlanGenerator.saveMealPlan(generatedPlan);
      setSuccess('Meal plan saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meal plan');
    } finally {
      setIsSaving(false);
    }
  };

  const getTotalCost = () => {
    if (!generatedPlan) return 0;
    return generatedPlan.meals.reduce((total, meal) => {
      return total + meal.foods.reduce((mealTotal, food) => {
        return mealTotal + (food.estimatedCost || 0);
      }, 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Generator Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Meal Plan Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {profile.targetCalories || 2000} cal
              </div>
              <div className="text-gray-600">Daily Target</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {profile.goal === 'bulking' ? 'Muscle Gain' : 
                 profile.goal === 'cutting' ? 'Fat Loss' : 'Maintenance'}
              </div>
              <div className="text-gray-600">Goal</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">Filipino Foods</div>
              <div className="text-gray-600">Cuisine Focus</div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleGenerateMealPlan}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Meal Plan
                </>
              )}
            </Button>

            {generatedPlan && (
              <Button 
                onClick={handleSaveMealPlan}
                disabled={isSaving}
                variant="outline"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Plan
                  </>
                )}
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Generated Meal Plan */}
      {generatedPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Meal Plan</span>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline">
                  <Target className="h-3 w-3 mr-1" />
                  {generatedPlan.totalCalories} cal
                </Badge>
                <Badge variant="outline">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatCurrency(getTotalCost(), locale, currency)}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mealTypes.map((mealType) => {
                const meal = generatedPlan.meals.find(m => m.type === mealType.key);
                if (!meal) return null;

                return (
                  <div key={mealType.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-sm">
                          {mealType.icon} {mealType.label}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {mealType.time}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGenerateSuggestions(mealType.key)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {meal.foods.map((food, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-medium">{food.name}</div>
                          <div className="text-gray-500">
                            {food.servingSize} • {food.calories} cal
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3" />

                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-medium">{meal.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">{meal.macros.protein.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-medium">{meal.macros.carbs.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fats:</span>
                        <span className="font-medium">{meal.macros.fats.toFixed(1)}g</span>
                      </div>
                    </div>

                    {/* Show suggestions if available */}
                    {suggestions[mealType.key] && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs font-medium mb-2">Alternatives:</div>
                        <div className="space-y-1">
                          {suggestions[mealType.key].slice(0, 2).map((suggestion, idx) => (
                            <div key={idx} className="text-xs text-gray-600">
                              {suggestion.alternatives.slice(0, 2).map(alt => alt.name).join(', ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Macro Summary */}
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {generatedPlan.totalCalories}
                  </div>
                  <div className="text-sm text-gray-600">Total Calories</div>
                  <div className="text-xs text-gray-500">
                    Target: {profile.targetCalories}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {generatedPlan.totalMacros.protein.toFixed(1)}g
                  </div>
                  <div className="text-sm text-gray-600">Protein</div>
                  <div className="text-xs text-gray-500">
                    Target: {profile.proteinGrams}g
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {generatedPlan.totalMacros.carbs.toFixed(1)}g
                  </div>
                  <div className="text-sm text-gray-600">Carbs</div>
                  <div className="text-xs text-gray-500">
                    Target: {profile.carbsGrams}g
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {generatedPlan.totalMacros.fats.toFixed(1)}g
                  </div>
                  <div className="text-sm text-gray-600">Fats</div>
                  <div className="text-xs text-gray-500">
                    Target: {profile.fatsGrams}g
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}