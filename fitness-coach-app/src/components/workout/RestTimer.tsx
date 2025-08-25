'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Timer,
  Volume2,
  VolumeX
} from 'lucide-react';
import { RestTimer as RestTimerUtil, formatTime } from '@/utils/rest-timer';

interface RestTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  onSkip: () => void;
  autoStart?: boolean;
}

export function RestTimer({ duration, onComplete, onSkip, autoStart = true }: RestTimerProps) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState<RestTimerUtil | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const restTimer = new RestTimerUtil(
      duration,
      (time) => setRemainingTime(time),
      () => {
        setIsRunning(false);
        setIsPaused(false);
        if (soundEnabled) {
          playCompletionSound();
        }
        onComplete();
      }
    );

    setTimer(restTimer);
    setRemainingTime(duration);

    if (autoStart) {
      restTimer.start();
      setIsRunning(true);
    }

    return () => {
      restTimer.stop();
    };
  }, [duration, onComplete, autoStart, soundEnabled]);

  const playCompletionSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStart = () => {
    if (timer) {
      timer.start();
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (timer) {
      timer.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (timer) {
      timer.resume();
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    if (timer) {
      timer.reset();
      setIsRunning(false);
      setIsPaused(false);
    }
  };

  const handleAddTime = (seconds: number) => {
    if (timer) {
      timer.addTime(seconds);
    }
  };

  const progressPercentage = ((duration - remainingTime) / duration) * 100;

  return (
    <Card className="border-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Rest Timer
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-bold font-mono">
            {formatTime(remainingTime)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {remainingTime <= 10 && remainingTime > 0 ? 'Almost ready!' : 'Take your rest'}
          </p>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercentage} className="h-2" />

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isRunning && !isPaused && (
            <Button onClick={handleStart} size="sm">
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
          
          {isRunning && !isPaused && (
            <Button onClick={handlePause} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
          
          {isPaused && (
            <Button onClick={handleResume} size="sm">
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button>
          )}

          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Time Adjustment */}
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => handleAddTime(-15)}
            variant="outline"
            size="sm"
            disabled={remainingTime <= 15}
          >
            <Minus className="h-3 w-3 mr-1" />
            15s
          </Button>
          <Button
            onClick={() => handleAddTime(-30)}
            variant="outline"
            size="sm"
            disabled={remainingTime <= 30}
          >
            <Minus className="h-3 w-3 mr-1" />
            30s
          </Button>
          <Button
            onClick={() => handleAddTime(30)}
            variant="outline"
            size="sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            30s
          </Button>
          <Button
            onClick={() => handleAddTime(60)}
            variant="outline"
            size="sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            1m
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onSkip}
            variant="outline"
            className="flex-1"
          >
            Skip Rest
          </Button>
          <Button
            onClick={onComplete}
            className="flex-1"
            disabled={remainingTime > 0}
          >
            {remainingTime > 0 ? `Wait ${formatTime(remainingTime)}` : 'Continue'}
          </Button>
        </div>

        {/* Rest Tips */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>💡 <strong>Rest Tips:</strong></p>
          <p>• Stay hydrated • Light stretching • Prepare for next set</p>
          {remainingTime <= 30 && remainingTime > 0 && (
            <p className="text-primary font-medium">Get ready for your next set!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}