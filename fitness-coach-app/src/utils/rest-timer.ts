export class RestTimer {
  private timerId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private duration: number = 0;
  private onTick: (remainingTime: number) => void;
  private onComplete: () => void;
  private isPaused: boolean = false;
  private remainingTime: number = 0;

  constructor(
    duration: number, // in seconds
    onTick: (remainingTime: number) => void,
    onComplete: () => void
  ) {
    this.duration = duration;
    this.remainingTime = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start(): void {
    if (this.timerId) {
      this.stop();
    }

    this.startTime = Date.now();
    this.isPaused = false;
    
    this.timerId = setInterval(() => {
      if (this.isPaused) return;

      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.remainingTime = Math.max(0, this.duration - elapsed);
      
      this.onTick(this.remainingTime);
      
      if (this.remainingTime <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);

    // Initial tick
    this.onTick(this.remainingTime);
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    if (this.isPaused) {
      this.startTime = Date.now() - (this.duration - this.remainingTime) * 1000;
      this.isPaused = false;
    }
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPaused = false;
  }

  reset(newDuration?: number): void {
    this.stop();
    if (newDuration !== undefined) {
      this.duration = newDuration;
    }
    this.remainingTime = this.duration;
    this.onTick(this.remainingTime);
  }

  addTime(seconds: number): void {
    this.duration += seconds;
    this.remainingTime += seconds;
    this.onTick(this.remainingTime);
  }

  getRemainingTime(): number {
    return this.remainingTime;
  }

  isRunning(): boolean {
    return this.timerId !== null && !this.isPaused;
  }

  isPausedState(): boolean {
    return this.isPaused;
  }
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getRestTimeRecommendation(exerciseType: string, intensity: 'light' | 'moderate' | 'heavy'): number {
  // Rest time recommendations in seconds
  const restTimes = {
    strength: {
      light: 60,    // 1 minute
      moderate: 120, // 2 minutes
      heavy: 180,   // 3 minutes
    },
    cardio: {
      light: 30,    // 30 seconds
      moderate: 60, // 1 minute
      heavy: 90,    // 1.5 minutes
    },
    flexibility: {
      light: 15,    // 15 seconds
      moderate: 30, // 30 seconds
      heavy: 45,    // 45 seconds
    }
  };

  return restTimes[exerciseType as keyof typeof restTimes]?.[intensity] || 120;
}