'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Target, Calendar, Weight } from 'lucide-react';
import { ProgressData } from '@/app/actions/progress';

interface ProgressChartsProps {
  progressData: ProgressData[];
  selectedExercise?: string;
}

export function ProgressCharts({ progressData, selectedExercise }: ProgressChartsProps) {
  const exerciseData = selectedExercise 
    ? progressData.find(p => p.exerciseId === selectedExercise)
    : progressData[0];

  if (!exerciseData || exerciseData.sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No progress data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exercise Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {exerciseData.exerciseName}
              {exerciseData.exerciseNameFilipino && (
                <span className="text-sm text-muted-foreground">
                  ({exerciseData.exerciseNameFilipino})
                </span>
              )}
            </CardTitle>
            <ProgressTrendBadge trend={exerciseData.progressMetrics.trend} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{exerciseData.progressMetrics.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(exerciseData.progressMetrics.volumeImprovement)}%
              </div>
              <div className="text-sm text-muted-foreground">Volume Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(exerciseData.progressMetrics.strengthImprovement)}%
              </div>
              <div className="text-sm text-muted-foreground">Strength Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(exerciseData.progressMetrics.consistencyScore)}
              </div>
              <div className="text-sm text-muted-foreground">Consistency Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Volume Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={exerciseData.sessions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number) => [value, 'Total Volume']}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalVolume" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weight Progress Chart */}
      {exerciseData.sessions.some(s => s.maxWeight) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="h-5 w-5" />
              Maximum Weight Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseData.sessions.filter(s => s.maxWeight)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value: number) => [`${value} kg`, 'Max Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="maxWeight" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Average Reps Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Reps Per Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseData.sessions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number) => [Math.round(value), 'Avg Reps']}
                />
                <Bar dataKey="averageReps" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ProgressTrendBadgeProps {
  trend: 'improving' | 'maintaining' | 'declining';
}

function ProgressTrendBadge({ trend }: ProgressTrendBadgeProps) {
  const config = {
    improving: {
      icon: TrendingUp,
      label: 'Improving',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    maintaining: {
      icon: Minus,
      label: 'Stable',
      variant: 'secondary' as const,
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    declining: {
      icon: TrendingDown,
      label: 'Declining',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 border-red-200'
    }
  };

  const { icon: Icon, label, className } = config[trend];

  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

interface WorkoutSummaryChartsProps {
  summary: {
    totalWorkouts: number;
    totalDuration: number;
    averageDuration: number;
    totalVolume: number;
    averageVolume: number;
    workoutFrequency: number;
    currentStreak: number;
    longestStreak: number;
    lastWorkout: string;
    favoriteExercises: {
      exerciseId: string;
      exerciseName: string;
      frequency: number;
    }[];
  };
}

export function WorkoutSummaryCharts({ summary }: WorkoutSummaryChartsProps) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Workout Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Workout Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{summary.totalWorkouts}</div>
              <div className="text-sm text-blue-600">Total Workouts</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(summary.totalDuration / 60)}h
              </div>
              <div className="text-sm text-green-600">Total Time</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{summary.currentStreak}</div>
              <div className="text-sm text-orange-600">Current Streak</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {summary.workoutFrequency.toFixed(1)}
              </div>
              <div className="text-sm text-purple-600">Per Week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Exercises */}
      <Card>
        <CardHeader>
          <CardTitle>Favorite Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.favoriteExercises.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.favoriteExercises}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ exerciseName, frequency }) => `${exerciseName} (${frequency})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="frequency"
                  >
                    {summary.favoriteExercises.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No exercise data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}