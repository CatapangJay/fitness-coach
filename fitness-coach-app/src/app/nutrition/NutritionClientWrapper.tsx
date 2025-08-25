'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, UserProfile } from '@/lib/supabase';
import { TDEEResults, MacroBreakdown, NutritionExplanations } from '@/components/nutrition';
import { calculateCompleteTDEE, convertWeight, convertHeight } from '@/utils/calculations';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function NutritionClientWrapper() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setProfileLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  return (
    <ProtectedRoute>
      {(loading || profileLoading) ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading nutrition data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : !profile ? (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-semibold">Complete Your Profile First</h2>
                  <p className="text-muted-foreground">
                    To see your personalized nutrition plan, you need to complete your fitness profile first.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/onboarding">
                      <Button>Complete Onboarding</Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <NutritionContent profile={profile} />
      )}
    </ProtectedRoute>
  );
}

function NutritionContent({ profile }: { profile: UserProfile }) {

  // Calculate TDEE based on profile
  const weightKg = convertWeight(
    profile.weight_value || 70,
    profile.weight_unit || 'kg',
    "kg"
  );
  
  const heightCm = convertHeight(
    profile.height_value || 170,
    profile.height_unit || 'cm',
    "cm"
  );

  const tdeeCalculation = calculateCompleteTDEE(
    profile.age || 25,
    profile.gender || 'male',
    weightKg,
    heightCm,
    profile.activity_level || 'moderately-active',
    profile.goal || 'maintain'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Your Nutrition Plan
                </h1>
                <p className="text-sm text-gray-600">
                  Personalized calorie and macro targets
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* TDEE Results */}
          <TDEEResults 
            calculation={tdeeCalculation}
            goal={profile.goal || 'maintain'}
            showExplanations={true}
          />

          {/* Macro Breakdown */}
          <MacroBreakdown 
            macros={tdeeCalculation.macros}
            targetCalories={tdeeCalculation.targetCalories}
            showChart={true}
            showFilipinoExamples={true}
          />

          {/* Nutrition Explanations */}
          <NutritionExplanations goal={profile.goal || 'maintain'} />
        </div>
      </main>
    </div>
  );
}