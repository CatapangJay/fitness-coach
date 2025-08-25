'use client';

import { User } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, User as UserIcon, Settings, Utensils, Dumbbell, Search, Calculator, Bell } from 'lucide-react';
import { UserProfile } from '@/lib/supabase';
import { AppNavigation } from '@/components/navigation/AppNavigation';
import Link from 'next/link';
import NotificationsPrompt from '@/components/settings/NotificationsPrompt';

interface DashboardContentProps {
  user: User;
  profile: UserProfile | null;
}

export function DashboardContent({ user, profile }: DashboardContentProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect will be handled by auth state change
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Fitness Coach Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile header */}
          <div className="md:hidden space-y-4">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold">
                  {user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-xs text-gray-500">Welcome Back</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user.email?.split('@')[0]} <span className="align-middle">👋</span>
                  </p>
                </div>
              </div>
              {/* Bell with badge */}
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border shadow-sm">
                <Bell className="h-5 w-5 text-gray-700" />
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] leading-4 text-center">9+</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <AppNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Mobile notifications permission prompt */}
        <div className="md:hidden mb-4">
          <NotificationsPrompt />
        </div>
        <div className="grid gap-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Fitness Journey! 🎉</CardTitle>
              <CardDescription>
                Your authentication is working perfectly. Let's get you started with your personalized fitness plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-blue-900">Account Status</h3>
                    <p className="text-sm text-blue-700">
                      Authenticated and ready to go!
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    ✓ Verified
                  </Badge>
                </div>

                {profile ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Profile Complete ✅</h3>
                    <p className="text-sm text-green-700 mb-2">
                      Your fitness profile is set up and ready for personalized recommendations.
                    </p>
                    <div className="text-xs text-green-600 space-y-1">
                      <div>• Age: {profile.age} years old</div>
                      <div>• Goal: {profile.goal}</div>
                      <div>• Activity Level: {profile.activity_level}</div>
                      <div>• Equipment: {profile.available_equipment?.join(', ')}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium text-yellow-900 mb-2">Complete Your Profile</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      To get personalized workout plans and meal suggestions, please complete your fitness profile.
                    </p>
                    <Link href="/onboarding">
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Complete Onboarding
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Metrics */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Metrics</CardTitle>
                <CardDescription>
                  Your current daily targets and plan highlights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border bg-white">
                    <div className="text-xs text-gray-500">Calories</div>
                    <div className="text-2xl font-semibold">{profile.target_calories ?? '—'}</div>
                    <div className="text-xs text-gray-500">kcal/day</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <div className="text-xs text-gray-500">Protein</div>
                    <div className="text-2xl font-semibold">{profile.protein_grams ?? '—'}</div>
                    <div className="text-xs text-gray-500">g/day</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <div className="text-xs text-gray-500">Carbs</div>
                    <div className="text-2xl font-semibold">{profile.carbs_grams ?? '—'}</div>
                    <div className="text-xs text-gray-500">g/day</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <div className="text-xs text-gray-500">Fats</div>
                    <div className="text-2xl font-semibold">{profile.fats_grams ?? '—'}</div>
                    <div className="text-xs text-gray-500">g/day</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Info Card - Temporary */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900">Debug Info (Temporary)</CardTitle>
              <CardDescription className="text-orange-700">
                Profile status for troubleshooting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Has Profile:</strong> {profile ? 'Yes' : 'No'}</div>
                {profile && (
                  <>
                    <div><strong>Profile ID:</strong> {profile.id}</div>
                    <div><strong>Age:</strong> {profile.age || 'Not set'}</div>
                    <div><strong>Gender:</strong> {profile.gender || 'Not set'}</div>
                    <div><strong>Goal:</strong> {profile.goal || 'Not set'}</div>
                    <div><strong>Activity Level:</strong> {profile.activity_level || 'Not set'}</div>
                    <div><strong>Equipment:</strong> {profile.available_equipment?.length || 0} items</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your current account details and authentication status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <span className="text-sm text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">User ID:</span>
                  <span className="text-sm text-gray-900 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Account Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Email Verified:</span>
                  <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                    {user.email_confirmed_at ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access - Only show if profile exists */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                  Jump to your personalized fitness tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/nutrition">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Nutrition Plan</h4>
                        <p className="text-sm text-gray-600">
                          View your daily calorie and macro targets
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/food-search">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Search className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Food Database</h4>
                        <p className="text-sm text-gray-600">
                          Search Filipino foods and calculate meals
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/meal-planner">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Meal Planner</h4>
                        <p className="text-sm text-gray-600">
                          Plan your daily meals with Filipino foods
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/exercises">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Exercise Database</h4>
                        <p className="text-sm text-gray-600">
                          Browse exercises with Filipino instructions
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-400">Workout Plans</h4>
                      <p className="text-sm text-gray-400">
                        Coming soon - personalized workout routines
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-400">Workout Tracking</h4>
                      <p className="text-sm text-gray-600">
                        Coming soon - track your progress
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps Card */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Continue building your personalized fitness experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Complete Onboarding</h4>
                    <p className="text-sm text-gray-600">
                      Set up your fitness goals, preferences, and available equipment
                    </p>
                  </div>
                  <Link href="/onboarding">
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-400">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-400">Get Your Workout Plan</h4>
                    <p className="text-sm text-gray-400">
                      Receive a customized workout plan based on your profile
                    </p>
                  </div>
                  <Button size="sm" variant="outline" disabled>
                    Locked
                  </Button>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-400">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-400">Start Tracking</h4>
                    <p className="text-sm text-gray-400">
                      Log your workouts and monitor your progress
                    </p>
                  </div>
                  <Button size="sm" variant="outline" disabled>
                    Locked
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}