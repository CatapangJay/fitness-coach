'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, WorkoutPlan, Exercise } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutPlanGenerator } from '@/components/workout/WorkoutPlanGenerator';
import { WorkoutPlanDisplay } from '@/components/workout/WorkoutPlanDisplay';
import { WorkoutPlanCard } from '@/components/workout/WorkoutPlanCard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { workoutPlanGenerator } from '@/lib/workout-plan-generator';
import { exerciseService } from '@/lib/exercise-service';
import { supabase } from '@/lib/supabase';
import { 
  Dumbbell, 
  Plus, 
  AlertCircle, 
  Loader2,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';

export function WorkoutPlannerClient() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        throw new Error('Please complete your profile setup first');
      }

      const profile: UserProfile = {
        id: profileData.id,
        userId: profileData.user_id,
        age: profileData.age,
        gender: profileData.gender,
        heightValue: profileData.height_value,
        heightUnit: profileData.height_unit,
        weightValue: profileData.weight_value,
        weightUnit: profileData.weight_unit,
        bodyComposition: profileData.body_composition,
        goal: profileData.goal,
        activityLevel: profileData.activity_level,
        workoutFrequency: profileData.workout_frequency,
        availableEquipment: profileData.available_equipment || [],
        bmr: profileData.bmr,
        tdee: profileData.tdee,
        targetCalories: profileData.target_calories,
        proteinGrams: profileData.protein_grams,
        proteinCalories: profileData.protein_calories,
        carbsGrams: profileData.carbs_grams,
        carbsCalories: profileData.carbs_calories,
        fatsGrams: profileData.fats_grams,
        fatsCalories: profileData.fats_calories,
        language: profileData.language,
        units: profileData.units,
        notifications: profileData.notifications,
        createdAt: new Date(profileData.created_at),
        updatedAt: new Date(profileData.updated_at),
      };

      setUserProfile(profile);

      // Load active workout plan
      const activePlan = await workoutPlanGenerator.getUserActiveWorkoutPlan(user.id);
      setActiveWorkoutPlan(activePlan);

      // Load exercises for display
      const exerciseResult = await exerciseService.searchExercises({}, 1, 1000);
      setExercises(exerciseResult.exercises);

    } catch (error) {
      console.error('Failed to load user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanGenerated = (plan: WorkoutPlan) => {
    setGeneratedPlan(plan);
    setActiveTab('preview');
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    try {
      setIsLoading(true);
      const planId = await workoutPlanGenerator.saveWorkoutPlan(generatedPlan);
      
      // Reload active plan
      if (user) {
        const activePlan = await workoutPlanGenerator.getUserActiveWorkoutPlan(user.id);
        setActiveWorkoutPlan(activePlan);
      }
      
      setGeneratedPlan(null);
      setActiveTab('current');
    } catch (error) {
      console.error('Failed to save workout plan:', error);
      setError(error instanceof Error ? error.message : 'Failed to save workout plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-muted-foreground">Loading your workout data...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!userProfile) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />
                <h2 className="text-xl font-semibold">Profile Setup Required</h2>
                <p className="text-muted-foreground">
                  Please complete your profile setup to generate workout plans.
                </p>
                <Button onClick={() => window.location.href = '/onboarding'}>
                  Complete Profile Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Dumbbell className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold">Workout Planner</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate personalized workout plans based on your goals, available equipment, and schedule.
            Track your progress and achieve your fitness objectives.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Current Plan
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate New
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedPlan}>
              <TrendingUp className="h-4 w-4" />
              Preview Plan
            </TabsTrigger>
          </TabsList>

          {/* Current Plan Tab */}
          <TabsContent value="current" className="space-y-6">
            {activeWorkoutPlan ? (
              <WorkoutPlanDisplay
                workoutPlan={activeWorkoutPlan}
                exercises={exercises}
                isActive={true}
                onEditPlan={() => setActiveTab('generate')}
                onStartWorkout={(dayIndex) => {
                  // TODO: Navigate to workout tracking
                  console.log('Start workout for day:', dayIndex);
                }}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-xl font-semibold">No Active Workout Plan</h3>
                    <p className="text-muted-foreground">
                      You don't have an active workout plan yet. Generate one to get started!
                    </p>
                    <Button onClick={() => setActiveTab('generate')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Your First Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Generate Plan Tab */}
          <TabsContent value="generate" className="space-y-6">
            <WorkoutPlanGenerator
              userProfile={userProfile}
              onPlanGenerated={handlePlanGenerated}
              onError={handleError}
            />
          </TabsContent>

          {/* Preview Plan Tab */}
          <TabsContent value="preview" className="space-y-6">
            {generatedPlan ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview Your New Workout Plan</CardTitle>
                    <p className="text-muted-foreground">
                      Review your generated workout plan below. You can save it to make it your active plan.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button onClick={handleSavePlan} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving Plan...
                          </>
                        ) : (
                          'Save & Activate Plan'
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('generate')}>
                        Modify Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <WorkoutPlanDisplay
                  workoutPlan={generatedPlan}
                  exercises={exercises}
                  isActive={false}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-xl font-semibold">No Plan to Preview</h3>
                    <p className="text-muted-foreground">
                      Generate a workout plan first to see the preview.
                    </p>
                    <Button onClick={() => setActiveTab('generate')}>
                      Generate Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}