'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { getProgressiveOverloadDetection } from '@/app/actions/progress';
import { toast } from 'sonner';

interface ProgressiveOverloadAnalysisProps {
  userId: string;
  exerciseId: string;
}

export function ProgressiveOverloadAnalysis({ userId, exerciseId }: ProgressiveOverloadAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId && exerciseId) {
      loadAnalysisData();
    }
  }, [userId, exerciseId]);

  const loadAnalysisData = async () => {
    setIsLoading(true);
    try {
      const result = await getProgressiveOverloadDetection(userId, exerciseId);
      if (result.success) {
        setAnalysisData(result);
      } else {
        toast.error(result.error || 'Failed to load analysis');
      }
    } catch (error) {
      console.error('Error loading progressive overload analysis:', error);
      toast.error('Failed to load analysis');
    } finally {
      setIsLoading(false);
    }
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

  if (!analysisData || !analysisData.sessions || analysisData.sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Not enough data for progressive overload analysis</p>
          <p className="text-sm text-muted-foreground mt-2">Complete at least 3 sessions to see analysis</p>
        </CardContent>
      </Card>
    );
  }

  const { sessions, analysis } = analysisData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progressive Overload Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {analysis.isProgressing ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <span className="font-medium">
                {analysis.isProgressing ? 'Progressing Well' : 'Needs Attention'}
              </span>
            </div>
            <ProgressTrendBadge trend={analysis.trend} />
          </div>

          {/* Volume Progress Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessions}>
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
                <Line 
                  type="monotone" 
                  dataKey="totalVolume" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Analysis Results */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Recent Performance</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Last session: {sessions[sessions.length - 1]?.totalVolume || 0} total volume</p>
                <p>Previous session: {sessions[sessions.length - 2]?.totalVolume || 0} total volume</p>
                {analysis.stagnantSessions > 0 && (
                  <p className="text-orange-600">
                    Stagnant for {analysis.stagnantSessions} session{analysis.stagnantSessions > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Trend Analysis</h4>
              <div className="text-sm text-muted-foreground">
                {analysis.trend === 'improving' && (
                  <p className="text-green-600">📈 Volume is increasing consistently</p>
                )}
                {analysis.trend === 'stable' && (
                  <p className="text-blue-600">➡️ Performance is stable</p>
                )}
                {analysis.trend === 'declining' && (
                  <p className="text-red-600">📉 Volume is decreasing</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}

            {analysis.nextSuggestion && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Next Workout Suggestion</h4>
                <p className="text-sm text-green-700">{analysis.nextSuggestion}</p>
              </div>
            )}

            {/* General Progressive Overload Tips */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Progressive Overload Methods</h4>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Weight:</span>
                  <span>Increase weight by 2.5-5kg when you can complete all sets easily</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Reps:</span>
                  <span>Add 1-2 reps per set when current reps feel easy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sets:</span>
                  <span>Add an extra set when recovery allows</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Frequency:</span>
                  <span>Train the exercise more often during the week</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ProgressTrendBadgeProps {
  trend: 'improving' | 'stable' | 'declining';
}

function ProgressTrendBadge({ trend }: ProgressTrendBadgeProps) {
  const config = {
    improving: {
      icon: TrendingUp,
      label: 'Improving',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    stable: {
      icon: TrendingUp,
      label: 'Stable',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    declining: {
      icon: TrendingDown,
      label: 'Declining',
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