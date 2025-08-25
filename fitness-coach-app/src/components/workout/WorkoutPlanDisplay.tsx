'use client';

import { useState } from 'react';
import { WorkoutPlan, Exercise } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Target, 
  Dumbbell, 
  Info, 
  Play,
  RotateCcw,
  Users
} from 'lucide-react';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';

interface WorkoutPlanDisplayProps {
  workoutPlan: WorkoutPlan;
  exercises: Exercise[]; // All exercises referenced in the plan
  onStartWorkout?: (dayIndex: number) => void;
  onEditPlan?: () => void;
  isActive?: boolean;
}

export function WorkoutPlanDisplay({
  workoutPlan,
  exercises,
  onStartWorkout,
  onEditPlan,
  isActive = false,
}: WorkoutPlanDisplayProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find(ex => ex.id === id);
  };

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case 'bulking':
        return 'Focus on building muscle mass through progressive overload and compound movements.';
      case 'cutting':
        return 'Maintain muscle while losing fat through higher volume training and shorter rest periods.';
      case 'maintain':
        return 'Maintain current fitness level with balanced strength and conditioning work.';
      default:
        return 'Customized workout plan based on your goals and preferences.';
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const totalExercises = workoutPlan.schedule.reduce((sum, day) => sum + day.exercises.length, 0);
  const avgDuration = Math.round(
    workoutPlan.schedule.reduce((sum, day) => sum + day.estimatedDuration, 0) / workoutPlan.schedule.length
  );

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{workoutPlan.name}</CardTitle>
                {isActive && (
                  <Badge variant="secondary">Active Plan</Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {getGoalDescription(workoutPlan.goal)}
              </p>
            </div>
            {onEditPlan && (
              <Button variant="outline" onClick={onEditPlan}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate Plan
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Plan Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{workoutPlan.duration} weeks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Dumbbell className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workouts/Week</p>
                <p className="font-semibold">{workoutPlan.schedule.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="font-semibold">{avgDuration} min</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Exercises</p>
                <p className="font-semibold">{totalExercises}</p>
              </div>
            </div>
          </div>

          {/* Goal Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Goal:</span>
            <Badge variant="outline" className="capitalize">
              {workoutPlan.goal === 'bulking' ? 'Muscle Building' : 
               workoutPlan.goal === 'cutting' ? 'Fat Loss' : 'Maintenance'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Workout Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-6">
              {workoutPlan.schedule.map((day, index) => (
                <TabsTrigger key={index} value={index.toString()} className="text-xs">
                  {getDayName(day.dayOfWeek).slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {workoutPlan.schedule.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={dayIndex.toString()} className="space-y-4">
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{getDayName(day.dayOfWeek)} Workout</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {day.exercises.length} exercises
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        ~{day.estimatedDuration} minutes
                      </span>
                    </div>
                  </div>
                  {onStartWorkout && (
                    <Button onClick={() => onStartWorkout(dayIndex)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Exercises List */}
                <div className="space-y-4">
                  {day.exercises.map((workoutExercise, exerciseIndex) => {
                    const exercise = getExerciseById(workoutExercise.exerciseId);
                    if (!exercise) return null;

                    return (
                      <Card key={exerciseIndex} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{exercise.name}</h4>
                              {exercise.nameFilipino && (
                                <p className="text-sm text-muted-foreground">{exercise.nameFilipino}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {exercise.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {exercise.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Exercise {exerciseIndex + 1}</p>
                            </div>
                          </div>

                          {/* Exercise Details */}
                          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Sets</p>
                              <p className="font-semibold text-lg">{workoutExercise.sets}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Reps</p>
                              <p className="font-semibold text-lg">{workoutExercise.reps}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Rest</p>
                              <p className="font-semibold text-lg">
                                {Math.floor(workoutExercise.restPeriod / 60)}:{(workoutExercise.restPeriod % 60).toString().padStart(2, '0')}
                              </p>
                            </div>
                          </div>

                          {/* Exercise Notes */}
                          {workoutExercise.notes && (
                            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-blue-800">{workoutExercise.notes}</p>
                            </div>
                          )}

                          {/* Muscle Groups */}
                          <div className="flex items-center gap-2 mt-3">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Targets:</span>
                            <div className="flex flex-wrap gap-1">
                              {exercise.muscleGroups.map((group, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs capitalize">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}