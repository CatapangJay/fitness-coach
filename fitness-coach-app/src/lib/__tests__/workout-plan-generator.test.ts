import { WorkoutPlanGenerator } from '../workout-plan-generator';
import { UserProfile } from '@/types';

// Mock the dependencies
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: { id: 'test-id' }, error: null }))
        }))
      }))
    }))
  }
}));

jest.mock('../exercise-service', () => ({
  exerciseService: {
    getExercisesForGoal: jest.fn(() => Promise.resolve([
      {
        id: 'exercise-1',
        name: 'Push-up',
        category: 'strength',
        muscleGroups: ['chest', 'triceps'],
        equipment: ['home'],
        difficulty: 'beginner',
        instructions: ['Get in plank position', 'Lower body', 'Push up'],
        formTips: ['Keep core tight'],
        commonMistakes: ['Sagging hips'],
      },
      {
        id: 'exercise-2',
        name: 'Squat',
        category: 'strength',
        muscleGroups: ['legs', 'glutes'],
        equipment: ['home'],
        difficulty: 'beginner',
        instructions: ['Stand with feet apart', 'Lower down', 'Stand up'],
        formTips: ['Keep chest up'],
        commonMistakes: ['Knees caving in'],
      }
    ]))
  }
}));

describe('WorkoutPlanGenerator', () => {
  let generator: WorkoutPlanGenerator;
  let mockUserProfile: UserProfile;

  beforeEach(() => {
    generator = new WorkoutPlanGenerator();
    mockUserProfile = {
      id: 'user-1',
      userId: 'auth-user-1',
      age: 25,
      gender: 'male',
      heightValue: 175,
      heightUnit: 'cm',
      weightValue: 70,
      weightUnit: 'kg',
      bodyComposition: 'average',
      goal: 'bulking',
      activityLevel: 'moderately-active',
      workoutFrequency: 3,
      availableEquipment: ['home', 'dumbbells'],
      language: 'en',
      units: 'metric',
      notifications: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('generateWorkoutPlan', () => {
    it('should generate a full-body plan for 3 days per week', async () => {
      const plan = await generator.generateWorkoutPlan({
        userProfile: mockUserProfile,
        durationWeeks: 8,
      });

      expect(plan).toBeDefined();
      expect(plan.userId).toBe(mockUserProfile.userId);
      expect(plan.goal).toBe(mockUserProfile.goal);
      expect(plan.duration).toBe(8);
      expect(plan.schedule).toHaveLength(3); // 3 workout days
      expect(plan.name).toContain('Muscle Building');
      expect(plan.name).toContain('Full Body');
    });

    it('should generate upper/lower split for 4 days per week', async () => {
      const modifiedProfile = { ...mockUserProfile, workoutFrequency: 4 };
      
      const plan = await generator.generateWorkoutPlan({
        userProfile: modifiedProfile,
        durationWeeks: 8,
      });

      expect(plan.schedule).toHaveLength(4); // 4 workout days
      expect(plan.name).toContain('Upper/Lower Split');
    });

    it('should generate push/pull/legs split for 5+ days per week', async () => {
      const modifiedProfile = { ...mockUserProfile, workoutFrequency: 5 };
      
      const plan = await generator.generateWorkoutPlan({
        userProfile: modifiedProfile,
        durationWeeks: 8,
      });

      expect(plan.schedule).toHaveLength(5); // 5 workout days
      expect(plan.name).toContain('Push/Pull/Legs');
    });

    it('should use custom plan name when provided', async () => {
      const customName = 'My Custom Plan';
      
      const plan = await generator.generateWorkoutPlan({
        userProfile: mockUserProfile,
        planName: customName,
        durationWeeks: 8,
      });

      expect(plan.name).toBe(customName);
    });

    it('should adjust sets and reps based on goal', async () => {
      // Test bulking goal
      const bulkingProfile = { ...mockUserProfile, goal: 'bulking' as const };
      const bulkingPlan = await generator.generateWorkoutPlan({
        userProfile: bulkingProfile,
        durationWeeks: 8,
      });

      // Should have lower rep ranges for bulking
      const firstExercise = bulkingPlan.schedule[0].exercises[0];
      expect(firstExercise.reps).toMatch(/6-8|8-12/);
      expect(firstExercise.restPeriod).toBeGreaterThanOrEqual(120); // At least 2 minutes

      // Test cutting goal
      const cuttingProfile = { ...mockUserProfile, goal: 'cutting' as const };
      const cuttingPlan = await generator.generateWorkoutPlan({
        userProfile: cuttingProfile,
        durationWeeks: 8,
      });

      // Should have higher rep ranges for cutting
      const firstCuttingExercise = cuttingPlan.schedule[0].exercises[0];
      expect(firstCuttingExercise.reps).toMatch(/12-15/);
      expect(firstCuttingExercise.restPeriod).toBeLessThanOrEqual(90); // Shorter rest for cutting
    });

    it('should include exercise notes with helpful tips', async () => {
      const plan = await generator.generateWorkoutPlan({
        userProfile: mockUserProfile,
        durationWeeks: 8,
      });

      const exerciseWithNotes = plan.schedule[0].exercises.find(ex => ex.notes);
      expect(exerciseWithNotes).toBeDefined();
      expect(exerciseWithNotes?.notes).toBeTruthy();
    });

    it('should calculate estimated workout duration', async () => {
      const plan = await generator.generateWorkoutPlan({
        userProfile: mockUserProfile,
        durationWeeks: 8,
      });

      plan.schedule.forEach(day => {
        expect(day.estimatedDuration).toBeGreaterThan(0);
        expect(day.estimatedDuration).toBeLessThan(120); // Should be reasonable duration
      });
    });
  });

  describe('workout split determination', () => {
    it('should determine beginner difficulty for sedentary users', async () => {
      const beginnerProfile = { 
        ...mockUserProfile, 
        activityLevel: 'sedentary' as const,
        bodyComposition: 'skinny' as const
      };
      
      const plan = await generator.generateWorkoutPlan({
        userProfile: beginnerProfile,
        durationWeeks: 8,
      });

      // Should generate a plan suitable for beginners
      expect(plan).toBeDefined();
      expect(plan.schedule.length).toBeLessThanOrEqual(3); // Not too many days for beginners
    });

    it('should handle different equipment availability', async () => {
      const homeOnlyProfile = { 
        ...mockUserProfile, 
        availableEquipment: ['home']
      };
      
      const plan = await generator.generateWorkoutPlan({
        userProfile: homeOnlyProfile,
        durationWeeks: 8,
      });

      expect(plan).toBeDefined();
      expect(plan.schedule.length).toBeGreaterThan(0);
    });
  });
});