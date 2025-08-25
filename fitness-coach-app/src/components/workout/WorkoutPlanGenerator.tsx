'use client';

import { useState } from 'react';
import { UserProfile, WorkoutPlan } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Target, Calendar, Clock } from 'lucide-react';
import { workoutPlanGenerator } from '@/lib/workout-plan-generator';

interface WorkoutPlanGeneratorProps {
  userProfile: UserProfile;
  onPlanGenerated: (plan: WorkoutPlan) => void;
  onError: (error: string) => void;
}

export function WorkoutPlanGenerator({
  userProfile,
  onPlanGenerated,
  onError,
}: WorkoutPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planName, setPlanName] = useState('');
  const [durationWeeks, setDurationWeeks] = useState([8]);
  const [customGoal, setCustomGoal] = useState(userProfile.goal);
  const [customFrequency, setCustomFrequency] = useState(userProfile.workoutFrequency);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      // Create a modified user profile with custom settings
      const modifiedProfile: UserProfile = {
        ...userProfile,
        goal: customGoal,
        workoutFrequency: customFrequency,
      };

      const plan = await workoutPlanGenerator.generateWorkoutPlan({
        userProfile: modifiedProfile,
        planName: planName || undefined,
        durationWeeks: durationWeeks[0],
      });

      onPlanGenerated(plan);
    } catch (error) {
      console.error('Failed to generate workout plan:', error);
      onError(error instanceof Error ? error.message : 'Failed to generate workout plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case 'bulking':
        return 'Build muscle mass with strength-focused training';
      case 'cutting':
        return 'Lose fat while maintaining muscle with higher volume';
      case 'maintain':
        return 'Maintain current fitness with balanced training';
      default:
        return '';
    }
  };

  const getFrequencyDescription = (frequency: number) => {
    if (frequency <= 3) {
      return 'Full-body workouts focusing on compound movements';
    } else if (frequency === 4) {
      return 'Upper/lower split for balanced muscle development';
    } else {
      return 'Push/pull/legs split for advanced training';
    }
  };

  const estimatedDuration = customFrequency <= 3 ? 60 : customFrequency === 4 ? 50 : 45;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Generate Your Workout Plan
        </CardTitle>
        <p className="text-muted-foreground">
          Create a personalized workout plan based on your goals and preferences.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Name */}
        <div className="space-y-2">
          <Label htmlFor="planName">Plan Name (Optional)</Label>
          <Input
            id="planName"
            placeholder="e.g., My Summer Transformation"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to auto-generate a name based on your goal
          </p>
        </div>

        {/* Goal Selection */}
        <div className="space-y-3">
          <Label>Fitness Goal</Label>
          <Select value={customGoal} onValueChange={(value) => setCustomGoal(value as 'bulking' | 'cutting' | 'maintain')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bulking">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Muscle Building (Bulking)</p>
                    <p className="text-xs text-muted-foreground">Focus on strength and size</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="cutting">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium">Fat Loss (Cutting)</p>
                    <p className="text-xs text-muted-foreground">Lose fat while maintaining muscle</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="maintain">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Maintenance</p>
                    <p className="text-xs text-muted-foreground">Maintain current fitness level</p>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {getGoalDescription(customGoal)}
          </p>
        </div>

        {/* Workout Frequency */}
        <div className="space-y-3">
          <Label>Workout Frequency: {customFrequency} days per week</Label>
          <Slider
            value={[customFrequency]}
            onValueChange={(value) => setCustomFrequency(value[0])}
            min={2}
            max={6}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2 days</span>
            <span>4 days</span>
            <span>6 days</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {getFrequencyDescription(customFrequency)}
          </p>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <Label>Plan Duration: {durationWeeks[0]} weeks</Label>
          <Slider
            value={durationWeeks}
            onValueChange={setDurationWeeks}
            min={4}
            max={16}
            step={2}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>4 weeks</span>
            <span>10 weeks</span>
            <span>16 weeks</span>
          </div>
        </div>

        {/* Plan Preview */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h4 className="font-medium">Plan Preview</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{durationWeeks[0]} weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Frequency</p>
                <p className="font-medium">{customFrequency}x/week</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Est. Time</p>
                <p className="font-medium">~{estimatedDuration} min</p>
              </div>
            </div>
          </div>
          
          {/* Equipment Preview */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Available Equipment:</p>
            <div className="flex flex-wrap gap-1">
              {userProfile.availableEquipment.map((equipment, index) => (
                <Badge key={index} variant="secondary" className="text-xs capitalize">
                  {equipment.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGeneratePlan} 
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Workout Plan
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          This will create a personalized workout plan based on your profile and preferences.
          You can always regenerate or modify the plan later.
        </p>
      </CardContent>
    </Card>
  );
}