'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  AlertTriangle, 
  Target,
  Lightbulb,
  X
} from 'lucide-react';
import { Exercise } from '@/types';

interface ExerciseInstructionsProps {
  exercise: Exercise;
  compact?: boolean;
}

export function ExerciseInstructions({ exercise, compact = false }: ExerciseInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showFormTips, setShowFormTips] = useState(false);
  const [showCommonMistakes, setShowCommonMistakes] = useState(false);

  if (compact) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <Info className="h-4 w-4 mr-2" />
            Exercise Instructions
            {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <ExerciseInstructionsContent 
            exercise={exercise} 
            showFormTips={showFormTips}
            setShowFormTips={setShowFormTips}
            showCommonMistakes={showCommonMistakes}
            setShowCommonMistakes={setShowCommonMistakes}
          />
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <ExerciseInstructionsContent 
      exercise={exercise}
      showFormTips={showFormTips}
      setShowFormTips={setShowFormTips}
      showCommonMistakes={showCommonMistakes}
      setShowCommonMistakes={setShowCommonMistakes}
    />
  );
}

interface ExerciseInstructionsContentProps {
  exercise: Exercise;
  showFormTips: boolean;
  setShowFormTips: (show: boolean) => void;
  showCommonMistakes: boolean;
  setShowCommonMistakes: (show: boolean) => void;
}

function ExerciseInstructionsContent({ 
  exercise, 
  showFormTips, 
  setShowFormTips,
  showCommonMistakes,
  setShowCommonMistakes
}: ExerciseInstructionsContentProps) {
  return (
    <div className="space-y-3">
      {/* Exercise Info */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{exercise.category}</Badge>
        <Badge variant="outline">{exercise.difficulty}</Badge>
        {exercise.muscleGroups.slice(0, 2).map(muscle => (
          <Badge key={muscle} variant="outline" className="text-xs">
            {muscle}
          </Badge>
        ))}
        {exercise.muscleGroups.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{exercise.muscleGroups.length - 2} more
          </Badge>
        )}
      </div>

      {/* Basic Instructions */}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              How to Perform
            </h4>
            <ol className="space-y-1 text-sm">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-2">
                  <span className="font-medium text-primary min-w-[20px]">
                    {index + 1}.
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {exercise.formTips && exercise.formTips.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFormTips(!showFormTips)}
            className="flex-1"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Form Tips
          </Button>
        )}
        
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCommonMistakes(!showCommonMistakes)}
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Common Mistakes
          </Button>
        )}
      </div>

      {/* Form Tips Modal */}
      {showFormTips && exercise.formTips && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                Form Tips
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFormTips(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-1 text-sm">
              {exercise.formTips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-blue-600 min-w-[8px]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Common Mistakes Modal */}
      {showCommonMistakes && exercise.commonMistakes && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Avoid These Mistakes
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommonMistakes(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-1 text-sm">
              {exercise.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-orange-600 min-w-[8px]">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Equipment Required */}
      {exercise.equipment && exercise.equipment.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <strong>Equipment needed:</strong> {exercise.equipment.join(', ')}
        </div>
      )}

      {/* Safety Notes */}
      {exercise.safetyNotes && exercise.safetyNotes.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Safety Notes
            </h4>
            <ul className="space-y-1 text-sm text-red-700">
              {exercise.safetyNotes.map((note, index) => (
                <li key={index} className="flex gap-2">
                  <span className="min-w-[8px]">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Modifications */}
      {exercise.modifications && (
        <div className="space-y-2">
          {exercise.modifications.beginner && exercise.modifications.beginner.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <h4 className="font-medium mb-2 text-green-700">
                  Beginner Modifications
                </h4>
                <ul className="space-y-1 text-sm text-green-700">
                  {exercise.modifications.beginner.map((mod, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="min-w-[8px]">•</span>
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {exercise.modifications.advanced && exercise.modifications.advanced.length > 0 && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-3">
                <h4 className="font-medium mb-2 text-purple-700">
                  Advanced Variations
                </h4>
                <ul className="space-y-1 text-sm text-purple-700">
                  {exercise.modifications.advanced.map((mod, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="min-w-[8px]">•</span>
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}