'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Dumbbell, Search, Target } from 'lucide-react';
import { Exercise } from '@/types';
import { ExerciseSearch } from '@/components/exercise/ExerciseSearch';
import { ExerciseDetail } from '@/components/exercise/ExerciseDetail';
import { AppNavigation } from '@/components/navigation/AppNavigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export function ExerciseBrowserClient() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [viewMode, setViewMode] = useState<'search' | 'detail'>('search');

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setViewMode('detail');
  };

  const handleBack = () => {
    setSelectedExercise(null);
    setViewMode('search');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Exercise Database
                  </h1>
                  <p className="text-sm text-gray-600">
                    Discover exercises with Filipino context and detailed instructions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  <Target className="h-3 w-3 mr-1" />
                  {viewMode === 'detail' ? 'Exercise Details' : 'Browse Exercises'}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <AppNavigation />

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {viewMode === 'search' ? (
            <div className="space-y-6">
              {/* Welcome Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Find Your Perfect Exercise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Browse our comprehensive exercise database with Filipino-friendly instructions, 
                    form tips, and equipment-based filtering. Each exercise includes detailed 
                    guidance to help you perform movements safely and effectively.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-2">💪</div>
                      <div className="font-semibold">Strength Training</div>
                      <div className="text-gray-600">Build muscle and power</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl mb-2">❤️</div>
                      <div className="font-semibold">Cardio Workouts</div>
                      <div className="text-gray-600">Improve heart health</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl mb-2">🤸</div>
                      <div className="font-semibold">Flexibility</div>
                      <div className="text-gray-600">Enhance mobility</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exercise Search */}
              <ExerciseSearch
                onExerciseSelect={handleExerciseSelect}
                showSelection={false}
              />
            </div>
          ) : (
            selectedExercise && (
              <ExerciseDetail
                exercise={selectedExercise}
                onBack={handleBack}
                onExerciseSelect={handleExerciseSelect}
              />
            )
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}