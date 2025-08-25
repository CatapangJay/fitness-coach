'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MessageSquare, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface WorkoutDifficultyFeedbackProps {
  userId: string;
}

interface DifficultyData {
  difficulty: 'too-easy' | 'just-right' | 'too-hard';
  count: number;
  percentage: number;
  color: string;
}

interface FeedbackAnalysis {
  totalSessions: number;
  difficultyBreakdown: DifficultyData[];
  recentTrend: string;
  recommendations: string[];
  averageDuration: number;
  consistencyScore: number;
}

export function WorkoutDifficultyFeedback({ userId }: WorkoutDifficultyFeedbackProps) {
  const [feedbackData, setFeedbackData] = useState<FeedbackAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadFeedbackData();
    }
  }, [userId]);

  const loadFeedbackData = async () => {
    setIsLoading(true);
    try {
      // This would typically be a server action, but for now we'll simulate the data
      // In a real implementation, you'd call a server action here
      const mockData = await getMockFeedbackData(userId);
      setFeedbackData(mockData);
    } catch (error) {
      console.error('Error loading feedback data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function - replace with actual server action
  const getMockFeedbackData = async (userId: string): Promise<FeedbackAnalysis> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      totalSessions: 15,
      difficultyBreakdown: [
        { difficulty: 'too-easy', count: 2, percentage: 13, color: '#10b981' },
        { difficulty: 'just-right', count: 10, percentage: 67, color: '#3b82f6' },
        { difficulty: 'too-hard', count: 3, percentage: 20, color: '#ef4444' }
      ],
      recentTrend: 'improving',
      recommendations: [
        'Your workouts are well-balanced! 67% are at the right difficulty.',
        'Consider increasing intensity slightly - only 13% feel too easy.',
        'Great consistency with workout completion rates.'
      ],
      averageDuration: 45,
      consistencyScore: 85
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feedbackData || feedbackData.totalSessions === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No workout feedback data available</p>
          <p className="text-sm text-muted-foreground mt-2">Complete workouts and provide difficulty feedback to see analysis</p>
        </CardContent>
      </Card>
    );
  }

  const optimalRange = feedbackData.difficultyBreakdown.find(d => d.difficulty === 'just-right')?.percentage || 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Optimal Difficulty</p>
                <p className="text-2xl font-bold">{optimalRange}%</p>
                <p className="text-xs text-muted-foreground">Just right workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Consistency Score</p>
                <p className="text-2xl font-bold">{feedbackData.consistencyScore}</p>
                <p className="text-xs text-muted-foreground">Out of 100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Avg Duration</p>
                <p className="text-2xl font-bold">{feedbackData.averageDuration}m</p>
                <p className="text-xs text-muted-foreground">Per workout</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workout Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedbackData.difficultyBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ difficulty, percentage }) => `${difficulty.replace('-', ' ')}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {feedbackData.difficultyBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Difficulty Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackData.difficultyBreakdown.map((item) => (
                <div key={item.difficulty} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium capitalize">
                        {item.difficulty.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.count} sessions</span>
                      <Badge variant="outline">{item.percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Analysis & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Status */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Current Status</h4>
              <div className="text-sm text-blue-700">
                {optimalRange >= 60 ? (
                  <p>✅ Excellent! Your workout difficulty is well-balanced with {optimalRange}% in the optimal range.</p>
                ) : optimalRange >= 40 ? (
                  <p>⚠️ Good progress, but consider adjusting difficulty. {optimalRange}% of workouts are optimally challenging.</p>
                ) : (
                  <p>🔄 Your workouts may need adjustment. Only {optimalRange}% are at the right difficulty level.</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="font-medium">Personalized Recommendations</h4>
              {feedbackData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                  <p className="text-sm text-green-700">{recommendation}</p>
                </div>
              ))}
            </div>

            {/* Difficulty Guidelines */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Difficulty Level Guidelines</h4>
              <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full mt-1" />
                  <div>
                    <span className="font-medium">Too Easy:</span>
                    <span className="text-muted-foreground ml-2">
                      You could do more reps/weight. Time to progress!
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full mt-1" />
                  <div>
                    <span className="font-medium">Just Right:</span>
                    <span className="text-muted-foreground ml-2">
                      Challenging but manageable. Perfect for growth!
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 bg-red-500 rounded-full mt-1" />
                  <div>
                    <span className="font-medium">Too Hard:</span>
                    <span className="text-muted-foreground ml-2">
                      Struggling to complete. Consider reducing intensity.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Aim for 60-80% of workouts to feel "just right"</li>
                <li>• 10-20% can be "too easy" (recovery/technique days)</li>
                <li>• Keep "too hard" workouts under 20% to avoid burnout</li>
                <li>• Adjust difficulty based on energy, sleep, and stress levels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}