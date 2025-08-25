'use client';

import { WorkoutPlan } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Target, Dumbbell } from 'lucide-react';

interface WorkoutPlanCardProps {
  workoutPlan: WorkoutPlan;
  onViewDetails?: () => void;
  onStartWorkout?: () => void;
  isActive?: boolean;
}

export function WorkoutPlanCard({
  workoutPlan,
  onViewDetails,
  onStartWorkout,
  isActive = false,
}: WorkoutPlanCardProps) {
  const totalWorkouts = workoutPlan.schedule.length;
  const avgDuration = Math.round(
    workoutPlan.schedule.reduce((sum, day) => sum + day.estimatedDuration, 0) / totalWorkouts
  );

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'bulking':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cutting':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintain':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'bulking':
        return 'Muscle Building';
      case 'cutting':
        return 'Fat Loss';
      case 'maintain':
        return 'Maintenance';
      default:
        return goal;
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{workoutPlan.name}</CardTitle>
            {isActive && (
              <Badge variant="secondary" className="text-xs">
                Active Plan
              </Badge>
            )}
          </div>
          <Badge className={getGoalColor(workoutPlan.goal)}>
            {getGoalLabel(workoutPlan.goal)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Plan Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{workoutPlan.duration} weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Workouts:</span>
            <span className="font-medium">{totalWorkouts}/week</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Avg Time:</span>
            <span className="font-medium">{avgDuration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Focus:</span>
            <span className="font-medium capitalize">{workoutPlan.goal}</span>
          </div>
        </div>

        {/* Workout Schedule Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Weekly Schedule</h4>
          <div className="space-y-1">
            {workoutPlan.schedule.map((day, index) => {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{dayNames[day.dayOfWeek]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {day.exercises.length} exercises
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {day.estimatedDuration} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
              View Details
            </Button>
          )}
          {onStartWorkout && (
            <Button size="sm" onClick={onStartWorkout} className="flex-1">
              Start Workout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}