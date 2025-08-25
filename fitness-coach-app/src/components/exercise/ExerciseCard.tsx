'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Check,
  Dumbbell,
  Target,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Users
} from 'lucide-react';
import { Exercise } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
  isSelected?: boolean;
  showSelection?: boolean;
  showFullDetails?: boolean;
}

export function ExerciseCard({ 
  exercise, 
  onSelect, 
  isSelected = false, 
  showSelection = false,
  showFullDetails = false 
}: ExerciseCardProps) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(showFullDetails);

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
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(exercise.category)}</span>
            <div>
              <h3 className="text-lg font-semibold">{exercise.name}</h3>
              {exercise.nameFilipino && (
                <p className="text-sm text-gray-600 italic">{exercise.nameFilipino}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
            {showSelection && onSelect && (
              <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSelect(exercise)}
              >
                {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {exercise.description && (
          <p className="text-gray-700">{exercise.description}</p>
        )}

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2">
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

        {/* Muscle Groups */}
        <div>
          <h4 className="text-sm font-medium mb-2">{t('exercise.target_muscles')}</h4>
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroups.map((group) => (
              <Badge key={group} variant="secondary" className="text-xs">
                {formatMuscleGroup(group)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <h4 className="text-sm font-medium mb-2">{t('exercise.equipment_needed')}</h4>
          <div className="flex flex-wrap gap-1">
            {exercise.equipment.map((eq) => (
              <Badge key={eq} variant="outline" className="text-xs flex items-center gap-1">
                <Dumbbell className="h-3 w-3" />
                {eq}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expandable Details */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 p-0 h-auto"
          >
            {expanded ? t('exercise.hide_details') : t('exercise.show_details')}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expanded && (
            <div className="mt-4 space-y-4">
              <Separator />

              {/* Instructions */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('exercise.how_to_perform')}
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Form Tips */}
              {exercise.formTips.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    {t('exercise.form_tips')}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {exercise.formTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {exercise.commonMistakes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {t('exercise.avoid_mistakes')}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {exercise.commonMistakes.map((mistake, index) => (
                      <li key={index}>{mistake}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {exercise.benefits && exercise.benefits.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    {t('exercise.benefits')}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {exercise.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Notes */}
              {exercise.safetyNotes && exercise.safetyNotes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    {t('exercise.safety_notes')}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    {exercise.safetyNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modifications */}
              {exercise.modifications && (
                <div>
                  <h4 className="text-sm font-medium mb-2">{t('exercise.modifications')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exercise.modifications.beginner && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-green-800 mb-1">
                          🟢 {t('exercise.beginner_options')}
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                          {exercise.modifications.beginner.map((mod, index) => (
                            <li key={index}>{mod}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exercise.modifications.advanced && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-red-800 mb-1">
                          🔴 {t('exercise.advanced_options')}
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                          {exercise.modifications.advanced.map((mod, index) => (
                            <li key={index}>{mod}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}