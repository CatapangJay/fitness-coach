import { Suspense } from 'react';
import { ProgressTrackingClient } from './ProgressTrackingClient';

export default function ProgressPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<div>Loading progress data...</div>}>
        <ProgressTrackingClient />
      </Suspense>
    </div>
  );
}