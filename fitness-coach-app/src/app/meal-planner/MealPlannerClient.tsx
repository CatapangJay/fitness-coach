'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Target, Calendar, Utensils, Loader2, Wand2, ChefHat } from 'lucide-react';
import { UserProfile, MealPlan } from '@/types';
import { supabase } from '@/lib/supabase';
import { MealCompositionCalculator } from '@/components/food/MealCompositionCalculator';
import { MealPlanGenerator } from '@/components/meal-plan/MealPlanGenerator';
import { MealPlanDisplay } from '@/components/meal-plan/MealPlanDisplay';
import { mealPlanGenerator } from '@/lib/meal-plan-generator';
import { AppNavigation } from '@/components/navigation/AppNavigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { formatCurrency, formatDateShort } from '@/utils/format';

export function MealPlannerClient() {
  const { user } = useAuth();
  const { locale, currency } = useLocale();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'merienda' | 'dinner'>('breakfast');
  const [mealCompositions, setMealCompositions] = useState<{ [key: string]: any }>({});
  const [generatedMealPlan, setGeneratedMealPlan] = useState<MealPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'manual'>('generator');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workSchedule, setWorkSchedule] = useState<'day' | 'night' | 'flex'>('day');
  const [climate, setClimate] = useState<'hot' | 'rainy' | 'cool'>('hot');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  // Persist cultural context (workSchedule, climate)
  const CONTEXT_KEY = 'fc.culturalContext';
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(CONTEXT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<{ workSchedule: 'day' | 'night' | 'flex'; climate: 'hot' | 'rainy' | 'cool' }>;
          if (parsed.workSchedule) setWorkSchedule(parsed.workSchedule);
          if (parsed.climate) setClimate(parsed.climate);
        }
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONTEXT_KEY, JSON.stringify({ workSchedule, climate }));
      }
    } catch {}
  }, [workSchedule, climate]);

  useEffect(() => {
    if (user) {
      // Fetch user profile and existing meal plan
      const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            router.push('/onboarding');
          } else {
            // Map database fields to UserProfile interface
            const userProfile: UserProfile = {
              id: data.id,
              userId: data.user_id,
              age: data.age,
              gender: data.gender,
              heightValue: data.height_value,
              heightUnit: data.height_unit,
              weightValue: data.weight_value,
              weightUnit: data.weight_unit,
              bodyComposition: data.body_composition,
              goal: data.goal,
              activityLevel: data.activity_level,
              workoutFrequency: data.workout_frequency,
              availableEquipment: data.available_equipment || [],
              bmr: data.bmr,
              tdee: data.tdee,
              targetCalories: data.target_calories,
              proteinGrams: data.protein_grams,
              proteinCalories: data.protein_calories,
              carbsGrams: data.carbs_grams,
              carbsCalories: data.carbs_calories,
              fatsGrams: data.fats_grams,
              fatsCalories: data.fats_calories,
              language: data.language || 'en',
              units: data.units || 'metric',
              notifications: data.notifications ?? true,
              workSchedule: data.work_schedule || undefined,
              climate: data.climate || undefined,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
            };
            setProfile(userProfile);
            // Initialize local state from profile if present (overrides localStorage defaults)
            if (data.work_schedule) setWorkSchedule(data.work_schedule);
            if (data.climate) setClimate(data.climate);
            
            // Try to load existing meal plan for selected date
            try {
              const existingPlan = await mealPlanGenerator.getMealPlan(user.id, selectedDate);
              if (existingPlan) {
                setGeneratedMealPlan(existingPlan);
              }
            } catch (planError) {
              console.log('No existing meal plan found for selected date');
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          router.push('/onboarding');
        } finally {
          setProfileLoading(false);
        }
      };

      fetchData();
    }
  }, [user, router, selectedDate]);

  // Persist changes to Supabase when user updates workSchedule/climate
  useEffect(() => {
    const saveContext = async () => {
      try {
        if (!user) return;
        await supabase
          .from('user_profiles')
          .update({ work_schedule: workSchedule, climate })
          .eq('user_id', user.id);
      } catch (e) {
        console.warn('Failed to persist cultural context to profile:', e);
      }
    };
    saveContext();
  }, [workSchedule, climate, user]);

  // Recommended meal times based on selected work schedule
  const mealTimes = mealPlanGenerator.getRecommendedMealTimes(workSchedule, selectedDate);
  const mealTypes = [
    { key: 'breakfast', label: 'Almusal (Breakfast)', icon: '🌅', time: mealTimes.breakfast },
    { key: 'lunch', label: 'Tanghalian (Lunch)', icon: '☀️', time: mealTimes.lunch },
    { key: 'merienda', label: 'Merienda', icon: '🍰', time: mealTimes.merienda },
    { key: 'dinner', label: 'Hapunan (Dinner)', icon: '🌙', time: mealTimes.dinner },
  ];

  const handleMealCalculated = (mealType: string, composition: any) => {
    setMealCompositions(prev => ({
      ...prev,
      [mealType]: composition,
    }));
  };

  const handleMealPlanGenerated = (mealPlan: MealPlan) => {
    setGeneratedMealPlan(mealPlan);
    setActiveTab('generator'); // Switch to generator tab to show the plan
  };

  const handleMealPlanUpdated = (updatedMealPlan: MealPlan) => {
    setGeneratedMealPlan(updatedMealPlan);
  };

  const fetchAiSuggestions = async () => {
    try {
      setAiLoading(true);
      setAiSuggestions(null);
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'meal',
          profile,
          context: { workSchedule, climate, date: selectedDate.toISOString() },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI request failed');
      setAiSuggestions(data.suggestions as string);
    } catch (e: any) {
      console.error('AI meal suggestions error', e);
      // non-blocking UI: show small inline error via suggestions text
      setAiSuggestions('Failed to get AI suggestions. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  const getTotalDailyNutrition = () => {
    if (generatedMealPlan) {
      return {
        calories: generatedMealPlan.totalCalories,
        protein: generatedMealPlan.totalMacros.protein,
        carbs: generatedMealPlan.totalMacros.carbs,
        fats: generatedMealPlan.totalMacros.fats,
        cost: generatedMealPlan.meals.reduce((total, meal) => {
          return total + meal.foods.reduce((mealTotal, food) => {
            return mealTotal + (food.estimatedCost || 0);
          }, 0);
        }, 0),
      };
    }

    // Fallback to manual meal compositions
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      cost: 0,
    };

    Object.values(mealCompositions).forEach((meal: any) => {
      if (meal) {
        totals.calories += meal.totalCalories || 0;
        totals.protein += meal.totalMacros?.protein || 0;
        totals.carbs += meal.totalMacros?.carbs || 0;
        totals.fats += meal.totalMacros?.fats || 0;
        totals.cost += meal.estimatedCost || 0;
      }
    });

    return totals;
  };

  const dailyTotals = getTotalDailyNutrition();
  const targetCalories = profile?.targetCalories || 0;
  const calorieProgress = targetCalories > 0 ? (dailyTotals.calories / targetCalories) * 100 : 0;

  // Show loading while fetching profile
  if (profileLoading || !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading meal planner...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Daily Meal Planner
                </h1>
                <p className="text-sm text-gray-600">
                  Plan your meals with Filipino foods
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDateShort(selectedDate, locale)}
              </Badge>
              {/* Work Schedule */}
              <Select value={workSchedule} onValueChange={(v) => setWorkSchedule(v as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                </SelectContent>
              </Select>
              {/* Climate */}
              <Select value={climate} onValueChange={(v) => setClimate(v as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Climate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="cool">Cool</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  disabled={selectedDate.toDateString() === new Date().toDateString()}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Daily Summary */}
          <div className="lg:col-span-1 space-y-4">
            {/* Daily Targets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Daily Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {targetCalories}
                  </div>
                  <div className="text-sm text-gray-600">Target Calories</div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Protein:</span>
                    <span className="font-medium">{profile.proteinGrams}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs:</span>
                    <span className="font-medium">{profile.carbsGrams}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fats:</span>
                    <span className="font-medium">{profile.fatsGrams}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dailyTotals.calories}
                  </div>
                  <div className="text-sm text-gray-600">Calories Planned</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {calorieProgress.toFixed(0)}% of target
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  />
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Protein:</span>
                    <span className="font-medium">{dailyTotals.protein.toFixed(1)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs:</span>
                    <span className="font-medium">{dailyTotals.carbs.toFixed(1)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fats:</span>
                    <span className="font-medium">{dailyTotals.fats.toFixed(1)}g</span>
                  </div>
                  {dailyTotals.cost > 0 && (
                    <div className="flex justify-between pt-2 border-t">
                      <span>Est. Cost:</span>
                      <span className="font-medium text-green-600">{formatCurrency(dailyTotals.cost, locale, currency)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Meal Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Meal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mealTypes.map((meal) => (
                    <button
                      key={meal.key}
                      onClick={() => setSelectedMealType(meal.key as any)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedMealType === meal.key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            {meal.icon} {meal.label}
                          </div>
                          <div className="text-xs text-gray-500">{meal.time}</div>
                        </div>
                        {mealCompositions[meal.key] && (
                          <Badge variant="outline" className="text-xs">
                            {mealCompositions[meal.key].totalCalories} cal
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Meal Planner */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Meal Planner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'generator' | 'manual')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generator" className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      AI Generator
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Manual Planning
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="generator" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Use AI to get culturally-aware ideas, then refine your plan.
                      </div>
                      <Button variant="outline" size="sm" onClick={fetchAiSuggestions} disabled={aiLoading}>
                        {aiLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Getting AI suggestions...
                          </>
                        ) : (
                          'Get AI Suggestions'
                        )}
                      </Button>
                    </div>
                    {aiSuggestions && (
                      <Card>
                        <CardHeader>
                          <CardTitle>AI Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap">{aiSuggestions}</div>
                        </CardContent>
                      </Card>
                    )}
                    {!generatedMealPlan ? (
                      <MealPlanGenerator
                        profile={profile}
                        onMealPlanGenerated={handleMealPlanGenerated}
                        currentDate={selectedDate}
                        workSchedule={workSchedule}
                        climate={climate}
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Generated Meal Plan</h3>
                          <Button
                            variant="outline"
                            onClick={() => setGeneratedMealPlan(null)}
                          >
                            Generate New Plan
                          </Button>
                        </div>
                        <MealPlanDisplay
                          mealPlan={generatedMealPlan}
                          onMealPlanUpdated={handleMealPlanUpdated}
                          targetCalories={targetCalories}
                          targetMacros={{
                            protein: profile?.proteinGrams || 0,
                            carbs: profile?.carbsGrams || 0,
                            fats: profile?.fatsGrams || 0,
                          }}
                          mealTimes={mealTimes}
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Plan {mealTypes.find(m => m.key === selectedMealType)?.label}
                        </h3>
                        <Badge variant="outline">
                          {mealTypes.find(m => m.key === selectedMealType)?.time}
                        </Badge>
                      </div>
                      <MealCompositionCalculator
                        mealType={selectedMealType}
                        onMealCalculated={(composition) => handleMealCalculated(selectedMealType, composition)}
                        initialFoods={mealCompositions[selectedMealType]?.foods || []}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}