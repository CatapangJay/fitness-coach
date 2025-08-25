'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  Plus, 
  Minus, 
  Check,
  X,
  Clock,
  Target,
  Weight
} from 'lucide-react';
import { RestTimer } from '@/components/workout/RestTimer';
import { ExerciseInstructions } from '@/components/workout/ExerciseInstructions';
import { 
  startWorkoutSession, 
  completeWorkoutSession, 
  updateWorkoutSet,
  cancelWorkoutSession,
  type CompleteWorkoutSessionData 
} from '@/app/actions/workout-sessions';
import { Exercise, WorkoutExercise, CompletedSet } from '@/types';
import { toast } from 'sonner';
import { useLocale } from '@/contexts/LocaleContext';
import { formatWeightFromKg, kgToLb, lbToKg } from '@/utils/units';

interface WorkoutSessionProps {
  userId: string;
  workoutPlan?: {
    id: string;
    name: string;
    goal: string;
  };
  workoutDay?: {
    id: string;
    name: string;
    exercises: (WorkoutExercise & { exercise: Exercise })[];
  };
  onSessionComplete?: () => void;
  onSessionCancel?: () => void;
}

interface ExerciseProgress {
  exerciseId: string;
  currentSet: number;
  completedSets: CompletedSet[];
  isResting: boolean;
  restStartTime?: number;
}

export function WorkoutSession({ 
  userId, 
  workoutPlan, 
  workoutDay, 
  onSessionComplete,
  onSessionCancel 
}: WorkoutSessionProps) {
  const { unitSystem, locale } = useLocale();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, ExerciseProgress>>({});
  const [sessionNotes, setSessionNotes] = useState('');
  const [difficulty, setDifficulty] = useState<'too-easy' | 'just-right' | 'too-hard'>('just-right');
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(120); // 2 minutes default
  const [isLoading, setIsLoading] = useState(false);

  const exercises = workoutDay?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    if (workoutDay && exercises.length > 0) {
      // Initialize exercise progress
      const initialProgress: Record<string, ExerciseProgress> = {};
      exercises.forEach(ex => {
        initialProgress[ex.exerciseId] = {
          exerciseId: ex.exerciseId,
          currentSet: 1,
          completedSets: [],
          isResting: false,
        };
      });
      setExerciseProgress(initialProgress);
    }
  }, [workoutDay, exercises]);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const result = await startWorkoutSession({
        userId,
        workoutPlanId: workoutPlan?.id,
        workoutDayId: workoutDay?.id,
      });

      if (result.success && result.session) {
        setSessionId(result.session.id);
        setIsSessionActive(true);
        setSessionStartTime(new Date(result.session.start_time));
        toast.success('Workout session started!');
      } else {
        toast.error(result.error || 'Failed to start workout session');
      }
    } catch (error) {
      toast.error('Failed to start workout session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSet = async (exerciseId: string, setNumber: number, reps: number, weight?: number) => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const result = await updateWorkoutSet({
        sessionId,
        exerciseId,
        setNumber,
        reps,
        weight,
        completed: true,
      });

      if (result.success) {
        setExerciseProgress(prev => {
          const updated = { ...prev };
          const progress = updated[exerciseId];
          if (progress) {
            // Add completed set
            const newSet: CompletedSet = {
              reps,
              weight,
              completed: true,
            };
            
            // Update or add the set
            const existingSetIndex = progress.completedSets.findIndex((_, index) => index === setNumber - 1);
            if (existingSetIndex >= 0) {
              progress.completedSets[existingSetIndex] = newSet;
            } else {
              progress.completedSets.push(newSet);
            }

            // Move to next set if not the last one
            const totalSets = exercises.find(ex => ex.exerciseId === exerciseId)?.sets || 0;
            if (setNumber < totalSets) {
              progress.currentSet = setNumber + 1;
              progress.isResting = true;
              progress.restStartTime = Date.now();
            }
          }
          return updated;
        });

        // Start rest timer if not the last set
        const totalSets = exercises.find(ex => ex.exerciseId === exerciseId)?.sets || 0;
        if (setNumber < totalSets) {
          const exercise = exercises.find(ex => ex.exerciseId === exerciseId);
          setRestDuration(exercise?.restPeriod || 120);
          setShowRestTimer(true);
        }

        toast.success(`Set ${setNumber} completed!`);
      } else {
        toast.error(result.error || 'Failed to save set');
      }
    } catch (error) {
      toast.error('Failed to save set');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipRest = () => {
    setShowRestTimer(false);
    setExerciseProgress(prev => {
      const updated = { ...prev };
      const progress = updated[currentExercise?.exerciseId];
      if (progress) {
        progress.isResting = false;
      }
      return updated;
    });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleCompleteSession = async () => {
    if (!sessionId || !sessionStartTime) return;

    setIsLoading(true);
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 1000 / 60); // minutes

      // Prepare completed exercises data
      const completedExercises = Object.entries(exerciseProgress)
        .filter(([_, progress]) => progress.completedSets.length > 0)
        .map(([exerciseId, progress]) => ({
          exerciseId,
          sets: progress.completedSets,
        }));

      const sessionData: CompleteWorkoutSessionData = {
        sessionId,
        endTime: endTime.toISOString(),
        duration,
        difficulty,
        notes: sessionNotes,
        exercises: completedExercises,
      };

      const result = await completeWorkoutSession(sessionData);

      if (result.success) {
        toast.success('Workout completed! Great job! 💪');
        setIsSessionActive(false);
        onSessionComplete?.();
      } else {
        toast.error(result.error || 'Failed to complete workout');
      }
    } catch (error) {
      toast.error('Failed to complete workout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const result = await cancelWorkoutSession(sessionId);
      
      if (result.success) {
        toast.success('Workout session cancelled');
        setIsSessionActive(false);
        onSessionCancel?.();
      } else {
        toast.error(result.error || 'Failed to cancel workout');
      }
    } catch (error) {
      toast.error('Failed to cancel workout');
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return '0:00';
    const now = new Date();
    const diff = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isSessionActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Start Workout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {workoutPlan && (
            <div>
              <h3 className="font-semibold">{workoutPlan.name}</h3>
              <Badge variant="secondary">{workoutPlan.goal}</Badge>
            </div>
          )}
          
          {workoutDay && (
            <div>
              <h4 className="font-medium">{workoutDay.name}</h4>
              <p className="text-sm text-muted-foreground">
                {exercises.length} exercises
              </p>
            </div>
          )}

          <Button 
            onClick={handleStartSession} 
            disabled={isLoading || !workoutDay}
            className="w-full"
          >
            {isLoading ? 'Starting...' : 'Start Workout'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentExercise) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No exercises found for this workout.</p>
        </CardContent>
      </Card>
    );
  }

  const currentProgress = exerciseProgress[currentExercise.exerciseId];
  const completedSets = currentProgress?.completedSets.length || 0;
  const totalSets = currentExercise.sets;

  return (
    <div className="space-y-4">
      {/* Session Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{workoutDay?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                <SessionTimer startTime={sessionStartTime} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Rest Timer */}
      {showRestTimer && (
        <RestTimer
          duration={restDuration}
          onComplete={handleSkipRest}
          onSkip={handleSkipRest}
        />
      )}

      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {currentExercise.exercise.name}
              {currentExercise.exercise.nameFilipino && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({currentExercise.exercise.nameFilipino})
                </span>
              )}
            </CardTitle>
            <Badge variant="outline">
              Set {currentProgress?.currentSet || 1} of {totalSets}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exercise Instructions */}
          <ExerciseInstructions exercise={currentExercise.exercise} />

          {/* Set Tracking */}
          <div className="space-y-3">
            <h4 className="font-medium">Track Your Sets</h4>
            
            {Array.from({ length: totalSets }, (_, index) => {
              const setNumber = index + 1;
              const isCurrentSet = setNumber === (currentProgress?.currentSet || 1);
              const completedSet = currentProgress?.completedSets[index];
              const isCompleted = completedSet?.completed || false;

              return (
                <SetTracker
                  key={setNumber}
                  setNumber={setNumber}
                  targetReps={currentExercise.reps}
                  targetWeight={currentExercise.weight}
                  isCurrentSet={isCurrentSet}
                  isCompleted={isCompleted}
                  completedSet={completedSet}
                  onComplete={(reps, weight) => handleCompleteSet(currentExercise.exerciseId, setNumber, reps, weight)}
                  disabled={isLoading}
                />
              );
            })}
          </div>

          {/* Exercise Navigation */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousExercise}
              disabled={currentExerciseIndex === 0}
              className="flex-1"
            >
              Previous Exercise
            </Button>
            <Button
              variant="outline"
              onClick={handleNextExercise}
              disabled={currentExerciseIndex === exercises.length - 1}
              className="flex-1"
            >
              Next Exercise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label htmlFor="difficulty">How was this workout?</Label>
            <div className="flex gap-2 mt-2">
              {(['too-easy', 'just-right', 'too-hard'] as const).map((level) => (
                <Button
                  key={level}
                  variant={difficulty === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(level)}
                >
                  {level === 'too-easy' && '😴 Too Easy'}
                  {level === 'just-right' && '💪 Just Right'}
                  {level === 'too-hard' && '🔥 Too Hard'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Workout Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did you feel? Any observations?"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleCancelSession}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Workout
            </Button>
            <Button
              onClick={handleCompleteSession}
              disabled={isLoading}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              Complete Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Set Tracker Component
interface SetTrackerProps {
  setNumber: number;
  targetReps: number | string;
  targetWeight?: number;
  isCurrentSet: boolean;
  isCompleted: boolean;
  completedSet?: CompletedSet;
  onComplete: (reps: number, weight?: number) => void;
  disabled: boolean;
}

function SetTracker({
  setNumber,
  targetReps,
  targetWeight,
  isCurrentSet,
  isCompleted,
  completedSet,
  onComplete,
  disabled
}: SetTrackerProps) {
  const { unitSystem, locale } = useLocale();
  const [reps, setReps] = useState(completedSet?.reps || (typeof targetReps === 'number' ? targetReps : 10));
  const [weight, setWeight] = useState(completedSet?.weight || targetWeight || 0);

  const handleComplete = () => {
    onComplete(reps, weight > 0 ? weight : undefined);
  };

  return (
    <div className={`p-3 border rounded-lg ${isCurrentSet ? 'border-primary bg-primary/5' : isCompleted ? 'border-green-500 bg-green-50' : 'border-border'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">Set {setNumber}</span>
          {isCompleted && <Check className="h-4 w-4 text-green-600" />}
          <span className="text-sm text-muted-foreground">
            Target: {targetReps} reps
            {targetWeight !== undefined && ` @ ${formatWeightFromKg(targetWeight, unitSystem, locale)}`}
          </span>
        </div>

        {!isCompleted && isCurrentSet && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReps(Math.max(1, reps - 1))}
                disabled={disabled}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center"
                disabled={disabled}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReps(reps + 1)}
                disabled={disabled}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <span className="text-sm">reps</span>
            </div>

            {targetWeight !== undefined && (
              <div className="flex items-center gap-1">
                <Weight className="h-4 w-4" />
                <Input
                  type="number"
                  value={unitSystem === 'imperial' ? kgToLb(weight) : weight}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (isNaN(v)) {
                      setWeight(0);
                    } else {
                      setWeight(unitSystem === 'imperial' ? lbToKg(v) : v);
                    }
                  }}
                  className="w-24 text-center"
                  step="0.5"
                  disabled={disabled}
                />
                <span className="text-sm">{unitSystem === 'imperial' ? 'lb' : 'kg'}</span>
              </div>
            )}

            <Button
              onClick={handleComplete}
              disabled={disabled}
              size="sm"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="text-sm text-muted-foreground">
            Completed: {completedSet?.reps} reps
            {completedSet?.weight !== undefined && ` @ ${formatWeightFromKg(completedSet.weight, unitSystem, locale)}`}
          </div>
        )}
      </div>
    </div>
  );
}

// Session Timer Component
function SessionTimer({ startTime }: { startTime: Date | null }) {
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <span>{duration}</span>;
}