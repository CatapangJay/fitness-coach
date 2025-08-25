'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkoutSession } from '@/components/workout/WorkoutSession';
import { getActiveWorkoutSession } from '@/app/actions/workout-sessions';
import { supabase } from '@/lib/supabase';
import { Exercise, WorkoutExercise } from '@/types';
import { Dumbbell, Calendar, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
}

interface WorkoutDay {
  id: string;
  name: string;
  day_of_week: number;
  estimated_duration: number;
  exercises: (WorkoutExercise & { exercise: Exercise })[];
}

export function WorkoutTrackingClient() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<any>(null);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Check for active session
      const sessionResult = await getActiveWorkoutSession(user.id);
      if (sessionResult.success && sessionResult.session) {
        setActiveSession(sessionResult.session);
      }

      // Load workout plans
      const { data: plans, error: plansError } = await supabase
        .from('workout_plans')
        .select('id, name, goal')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (plansError) {
        console.error('Error loading workout plans:', plansError);
        toast.error('Failed to load workout plans');
      } else {
        setWorkoutPlans(plans || []);
        if (plans && plans.length > 0) {
          setSelectedPlan(plans[0]);
          await loadWorkoutDays(plans[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load workout data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkoutDays = async (planId: string) => {
    try {
      const { data: days, error } = await supabase
        .from('workout_days')
        .select(`
          id,
          name,
          day_of_week,
          estimated_duration,
          workout_exercises(
            id,
            sets,
            reps,
            weight,
            rest_period,
            order_index,
            notes,
            exercises(
              id,
              name,
              name_filipino,
              category,
              muscle_groups,
              equipment,
              difficulty,
              instructions,
              form_tips,
              common_mistakes
            )
          )
        `)
        .eq('workout_plan_id', planId)
        .order('day_of_week');

      if (error) {
        console.error('Error loading workout days:', error);
        toast.error('Failed to load workout days');
        return;
      }

      // Transform the data to match our interface
      const transformedDays: WorkoutDay[] = (days || []).map(day => ({
        id: day.id,
        name: day.name,
        day_of_week: day.day_of_week,
        estimated_duration: day.estimated_duration,
        exercises: (day.workout_exercises || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((we: any) => ({
            exerciseId: we.exercises.id,
            sets: we.sets,
            reps: we.reps,
            weight: we.weight,
            restPeriod: we.rest_period,
            notes: we.notes,
            exercise: {
              id: we.exercises.id,
              name: we.exercises.name,
              nameFilipino: we.exercises.name_filipino,
              category: we.exercises.category,
              muscleGroups: we.exercises.muscle_groups || [],
              equipment: we.exercises.equipment || [],
              difficulty: we.exercises.difficulty,
              instructions: we.exercises.instructions || [],
              formTips: we.exercises.form_tips || [],
              commonMistakes: we.exercises.common_mistakes || [],
            }
          }))
      }));

      setWorkoutDays(transformedDays);
      
      // Auto-select today's workout if available
      const today = new Date().getDay();
      const todaysWorkout = transformedDays.find(day => day.day_of_week === today);
      if (todaysWorkout) {
        setSelectedDay(todaysWorkout);
      } else if (transformedDays.length > 0) {
        setSelectedDay(transformedDays[0]);
      }
    } catch (error) {
      console.error('Error loading workout days:', error);
      toast.error('Failed to load workout days');
    }
  };

  const handlePlanChange = async (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setSelectedDay(null);
    await loadWorkoutDays(plan.id);
  };

  const handleSessionComplete = () => {
    setActiveSession(null);
    toast.success('Great workout! Check your progress to see improvements.');
  };

  const handleSessionCancel = () => {
    setActiveSession(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-48 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please log in to track your workouts.</p>
        </CardContent>
      </Card>
    );
  }

  // If there's an active session, show the workout session component
  if (activeSession) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Active Workout</h1>
        </div>
        
        <WorkoutSession
          userId={user.id}
          workoutPlan={selectedPlan || undefined}
          workoutDay={selectedDay || undefined}
          onSessionComplete={handleSessionComplete}
          onSessionCancel={handleSessionCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Dumbbell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Workout Tracking</h1>
      </div>

      {workoutPlans.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No Workout Plans Found</h3>
              <p>Create a workout plan first to start tracking your workouts.</p>
            </div>
            <Button onClick={() => window.location.href = '/workout-planner'}>
              Create Workout Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Workout Plan Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Workout Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {workoutPlans.map(plan => (
                  <div
                    key={plan.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan?.id === plan.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handlePlanChange(plan)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{plan.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {plan.goal}
                        </Badge>
                      </div>
                      {selectedPlan?.id === plan.id && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workout Day Selection */}
          {selectedPlan && workoutDays.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Today's Workout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {workoutDays.map(day => {
                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const isToday = day.day_of_week === new Date().getDay();
                    
                    return (
                      <div
                        key={day.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDay?.id === day.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        } ${isToday ? 'ring-2 ring-primary/20' : ''}`}
                        onClick={() => setSelectedDay(day)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{day.name}</h3>
                              {isToday && <Badge variant="default" className="text-xs">Today</Badge>}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {dayNames[day.day_of_week]}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {day.estimated_duration} min
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {day.exercises.length} exercises
                              </div>
                            </div>
                          </div>
                          {selectedDay?.id === day.id && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Start Workout */}
          {selectedDay && (
            <WorkoutSession
              userId={user.id}
              workoutPlan={selectedPlan}
              workoutDay={selectedDay}
              onSessionComplete={handleSessionComplete}
              onSessionCancel={handleSessionCancel}
            />
          )}
        </>
      )}
    </div>
  );
}