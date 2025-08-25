import Link from "next/link";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClientIcon from "@/components/common/ClientIcon";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { session } } = await supabase.auth.getSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClientIcon name="dumbbell" className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Fitness Coach</h1>
          </div>
          <Badge variant="secondary">v1.0.0</Badge>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personalized Filipino Fitness Coach
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get customized workout plans, meal suggestions with Filipino foods, and track your progress 
            with an app designed specifically for Filipino fitness enthusiasts.
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="space-x-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClientIcon name="target" className="h-5 w-5 text-blue-600" />
                <span>Personalized Plans</span>
              </CardTitle>
              <CardDescription>
                Custom workout and meal plans based on your goals, equipment, and Filipino lifestyle
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClientIcon name="trending-up" className="h-5 w-5 text-green-600" />
                <span>Progress Tracking</span>
              </CardTitle>
              <CardDescription>
                Monitor your workouts, track improvements, and celebrate your fitness milestones
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClientIcon name="users" className="h-5 w-5 text-purple-600" />
                <span>Filipino-Focused</span>
              </CardTitle>
              <CardDescription>
                Meal plans with local foods, work schedule awareness, and cultural context
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Setup Status */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Authentication System Ready! 🎉</CardTitle>
            <CardDescription>
              Complete authentication system with Supabase Auth integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span>User registration and login forms</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span>Password reset functionality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span>Protected route middleware</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span>Session management with auto-refresh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span>Authentication context and hooks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
