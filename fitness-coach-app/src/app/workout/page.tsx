import { Suspense } from 'react';
import { WorkoutTrackingClient } from './WorkoutTrackingClient';

export default function WorkoutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<div>Loading workout...</div>}>
        <WorkoutTrackingClient />
      </Suspense>

    </div>
  );
}