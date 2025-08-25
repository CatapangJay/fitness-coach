'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Target,
  Dumbbell,
  Users,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Exercise } from '@/types';
import { exerciseService } from '@/lib/exercise-service';
import { ExerciseCard } from './ExerciseCard';

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack?: () => void;
  onExerciseSelect?: (exercise: Exercise) => void;
}

export function ExerciseDetail({ exercise, onBack, onExerciseSelect }: ExerciseDetailProps) {
  const [alternatives, setAlternatives] = useState<Exercise[]>([]);
  const [progressionPath, setProgressionPath] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedExercises = async () => {
      setLoading(true);
      try {
        const [alternativesData, progressionData] = await Promise.all([
          exerciseService.getAlternativeExercises(exercise.id),
          exerciseService.getProgressionPath(exercise.id),
        ]);
        setAlternatives(alternativesData);
        setProgressionPath(progressionData);
      } catch (error) {
        console.error('Failed to load related exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedExercises();
  }, [exercise.id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return '💪';
      case 'cardio': return '❤️';
      case 'flexibility': return '🤸';
      default: return '🏃';
    }
  };

  const formatMuscleGroup = (group: string) => {
    return group.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">{getCategoryIcon(exercise.category)}</span>
                <div>
                  <h1 className="text-2xl font-bold">{exercise.name}</h1>
                  {exercise.nameFilipino && (
                    <p className="text-lg text-gray-600 italic">{exercise.nameFilipino}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {exercise.category}
                </Badge>
                {exercise.caloriesPerMinute && (
                  <Badge variant="outline">
                    🔥 {exercise.caloriesPerMinute} cal/min
                  </Badge>
                )}
              </div>
            </div>
            <div className="w-20"> {/* Spacer for centering */}</div>
          </div>
        </CardHeader>
        
        {exercise.description && (
          <CardContent>
            <p className="text-center text-gray-700 text-lg">{exercise.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Muscle Groups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Target Muscles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map((group) => (
                <Badge key={group} variant="secondary">
                  {formatMuscleGroup(group)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dumbbell className="h-5 w-5" />
              Equipment Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((eq) => (
                <Badge key={eq} variant="outline" className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  {eq}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            How to Perform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="leading-relaxed">{instruction}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Form Tips */}
      {exercise.formTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Form Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {exercise.formTips.map((tip, index) => (
                <li key={index} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Common Mistakes */}
      {exercise.commonMistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {exercise.commonMistakes.map((mistake, index) => (
                <li key={index} className="leading-relaxed">{mistake}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {exercise.benefits && exercise.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {exercise.benefits.map((benefit, index) => (
                <li key={index} className="leading-relaxed">{benefit}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Safety Notes */}
      {exercise.safetyNotes && exercise.safetyNotes.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Safety Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              {exercise.safetyNotes.map((note, index) => (
                <li key={index} className="leading-relaxed">{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Modifications */}
      {exercise.modifications && (
        <Card>
          <CardHeader>
            <CardTitle>Exercise Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercise.modifications.beginner && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    🟢 Beginner Options
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                    {exercise.modifications.beginner.map((mod, index) => (
                      <li key={index}>{mod}</li>
                    ))}
                  </ul>
                </div>
              )}
              {exercise.modifications.advanced && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                    🔴 Advanced Options
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    {exercise.modifications.advanced.map((mod, index) => (
                      <li key={index}>{mod}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Exercises */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading related exercises...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Alternative Exercises */}
          {alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Alternative Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alternatives.map((alt) => (
                    <ExerciseCard
                      key={alt.id}
                      exercise={alt}
                      onSelect={onExerciseSelect}
                      showSelection={!!onExerciseSelect}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progression Path */}
          {progressionPath.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Progression Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressionPath.map((prog, index) => (
                    <div key={prog.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <ExerciseCard
                          exercise={prog}
                          onSelect={onExerciseSelect}
                          showSelection={!!onExerciseSelect}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}