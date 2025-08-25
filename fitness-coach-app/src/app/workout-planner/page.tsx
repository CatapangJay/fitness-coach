import { Metadata } from 'next';
import { WorkoutPlannerClient } from './WorkoutPlannerClient';

export const metadata: Metadata = {
  title: 'Workout Planner - Fitness Coach',
  description: 'Generate and manage your personalized workout plans',
};

export default function WorkoutPlannerPage() {
  return <WorkoutPlannerClient />;
}