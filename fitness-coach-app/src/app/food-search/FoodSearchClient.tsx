'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Calculator } from 'lucide-react';
import { FoodSearch } from '@/components/food/FoodSearch';
import { MealCompositionCalculator } from '@/components/food/MealCompositionCalculator';
import { AppNavigation } from '@/components/navigation/AppNavigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export function FoodSearchClient() {

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
                <h1 className="text-xl font-semibold text-gray-900">
                  Filipino Food Database
                </h1>
                <p className="text-sm text-gray-600">
                  Search and explore Filipino foods with nutrition information
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/meal-planner">
                <Button size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Meal Planner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Food Search */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Food Search</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Browse our database of Filipino foods with detailed nutrition information, 
              local availability, and estimated costs.
            </p>
            <FoodSearch showSelection={false} />
          </div>

          {/* Quick Meal Calculator */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-semibold">Quick Meal Calculator</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Add foods to calculate total nutrition and cost. For full meal planning, 
              use the <Link href="/meal-planner" className="text-blue-600 hover:underline">Meal Planner</Link>.
            </p>
            <MealCompositionCalculator />
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Using the Food Database</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Search Tips:</h4>
              <ul className="space-y-1">
                <li>• Try both English and Filipino names (e.g., "bangus" or "milkfish")</li>
                <li>• Use filters to find foods by category or region</li>
                <li>• Look for the "Local" badge for commonly available foods</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Portion Helpers:</h4>
              <ul className="space-y-1">
                <li>• Use familiar Filipino measurements like "tasa" (cup)</li>
                <li>• "Piraso" means one piece (for fish, chicken, etc.)</li>
                <li>• Costs are estimates and may vary by location</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}