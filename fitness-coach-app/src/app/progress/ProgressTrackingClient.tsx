'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCharts, WorkoutSummaryCharts } from '@/components/progress/ProgressCharts';
import { ProgressiveOverloadAnalysis } from '@/components/progress/ProgressiveOverloadAnalysis';
import { WorkoutDifficultyFeedback } from '@/components/progress/WorkoutDifficultyFeedback';
import { 
  getProgressData, 
  getWorkoutSummary, 
  getProgressiveOverloadDetection,
  type ProgressData 
} from '@/app/actions/progress';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Activity,
  BarChart3,
  Clock,
  Flame
} from 'lucide-react';
import { toast } from 'sonner';

export function ProgressTrackingClient() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [workoutSummary, setWorkoutSummary] = useState<any>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('90');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user, selectedTimeframe]);

  const loadProgressData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [progressResult, summaryResult] = await Promise.all([
        getProgressData(user.id, undefined, parseInt(selectedTimeframe)),
        getWorkoutSummary(user.id, parseInt(selectedTimeframe))
      ]);

      setProgressData(progressResult);
      setWorkoutSummary(summaryResult);

      if (progressResult.length > 0 && !selectedExercise) {
        setSelectedExercise(progressResult[0].exerciseId);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      toast.error('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please log in to view your progress.</p>
        </CardContent>
      </Card>
    );
  }

  if (!workoutSummary || workoutSummary.totalWorkouts === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Progress Tracking</h1>
        </div>

        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No Workout Data Found</h3>
              <p>Complete some workouts to see your progress and improvements.</p>
            </div>
            <Button onClick={() => window.location.href = '/workout'}>
              Start Your First Workout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Progress Tracking</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="180">6 Months</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Progress</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Total Workouts</p>
                    <p className="text-2xl font-bold">{workoutSummary.totalWorkouts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Total Time</p>
                    <p className="text-2xl font-bold">{Math.round(workoutSummary.totalDuration / 60)}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Current Streak</p>
                    <p className="text-2xl font-bold">{workoutSummary.currentStreak}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Weekly Frequency</p>
                    <p className="text-2xl font-bold">{workoutSummary.workoutFrequency.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workout Summary Charts */}
          <WorkoutSummaryCharts summary={workoutSummary} />

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workoutSummary.currentStreak > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="font-medium">Current Streak: {workoutSummary.currentStreak} days</p>
                      <p className="text-sm text-muted-foreground">Keep it up! Consistency is key.</p>
                    </div>
                  </div>
                )}
                
                {workoutSummary.longestStreak > workoutSummary.currentStreak && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <div>
                      <p className="font-medium">Personal Best: {workoutSummary.longestStreak} day streak</p>
                      <p className="text-sm text-muted-foreground">Your longest workout streak so far.</p>
                    </div>
                  </div>
                )}

                {workoutSummary.totalWorkouts >= 10 && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="h-2 w-2 bg-purple-500 rounded-full" />
                    <div>
                      <p className="font-medium">Milestone: {workoutSummary.totalWorkouts} workouts completed</p>
                      <p className="text-sm text-muted-foreground">You're building a great habit!</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          {progressData.length > 0 && (
            <>
              <div className="flex items-center gap-4">
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {progressData.map(exercise => (
                      <SelectItem key={exercise.exerciseId} value={exercise.exerciseId}>
                        {exercise.exerciseName}
                        {exercise.exerciseNameFilipino && ` (${exercise.exerciseNameFilipino})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ProgressCharts 
                progressData={progressData} 
                selectedExercise={selectedExercise}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {selectedExercise && (
            <ProgressiveOverloadAnalysis 
              userId={user.id}
              exerciseId={selectedExercise}
            />
          )}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <WorkoutDifficultyFeedback userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}