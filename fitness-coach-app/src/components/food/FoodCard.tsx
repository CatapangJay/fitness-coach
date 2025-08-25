'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, MapPin, DollarSign } from 'lucide-react';
import { FoodItem } from '@/types';

interface FoodCardProps {
  food: FoodItem;
  onSelect?: () => void;
  isSelected?: boolean;
  showSelection?: boolean;
  showNutrition?: boolean;
}

export function FoodCard({ 
  food, 
  onSelect, 
  isSelected = false, 
  showSelection = true,
  showNutrition = true 
}: FoodCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      protein: 'bg-red-100 text-red-800',
      carbs: 'bg-yellow-100 text-yellow-800',
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-orange-100 text-orange-800',
      fats: 'bg-purple-100 text-purple-800',
      beverages: 'bg-blue-100 text-blue-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatCost = (cost?: number) => {
    if (!cost) return null;
    return `₱${cost.toFixed(2)}`;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {food.name}
              {food.nameFilipino && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({food.nameFilipino})
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getCategoryColor(food.category)}>
                {food.category}
              </Badge>
              {food.commonInPhilippines && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  Local
                </Badge>
              )}
            </div>
          </div>
          
          {showSelection && onSelect && (
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={onSelect}
              className="ml-2"
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Selected
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Serving Size */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Serving:</span> {food.servingSize}
          </div>

          {/* Nutrition Info */}
          {showNutrition && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Calories:</span>
                  <span className="font-medium">{food.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein:</span>
                  <span className="font-medium">{food.macros.protein}g</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Carbs:</span>
                  <span className="font-medium">{food.macros.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fats:</span>
                  <span className="font-medium">{food.macros.fats}g</span>
                </div>
              </div>
            </div>
          )}

          {/* Cost */}
          {food.estimatedCost && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estimated cost:</span>
              <span className="font-medium text-green-600 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                {formatCost(food.estimatedCost)}
              </span>
            </div>
          )}

          {/* Macros Bar */}
          {showNutrition && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Macro breakdown</div>
              <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                <div 
                  className="bg-red-400" 
                  style={{ 
                    width: `${(food.macros.protein * 4 / food.calories) * 100}%` 
                  }}
                  title={`Protein: ${food.macros.protein}g`}
                />
                <div 
                  className="bg-yellow-400" 
                  style={{ 
                    width: `${(food.macros.carbs * 4 / food.calories) * 100}%` 
                  }}
                  title={`Carbs: ${food.macros.carbs}g`}
                />
                <div 
                  className="bg-purple-400" 
                  style={{ 
                    width: `${(food.macros.fats * 9 / food.calories) * 100}%` 
                  }}
                  title={`Fats: ${food.macros.fats}g`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Protein</span>
                <span>Carbs</span>
                <span>Fats</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}