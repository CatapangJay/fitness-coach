'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, Info } from 'lucide-react';
import { FoodItem } from '@/types';
import { mealCalculator, PortionHelper as PortionHelperType } from '@/utils/meal-calculator';

interface PortionHelperProps {
  food: FoodItem;
  onPortionCalculated?: (quantity: number, unit: string, nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    cost: number;
  }) => void;
}

export function PortionHelper({ food, onPortionCalculated }: PortionHelperProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [calculatedNutrition, setCalculatedNutrition] = useState<any>(null);

  const portionSuggestions = mealCalculator.getPortionSuggestions(food);

  const calculateNutrition = () => {
    if (!selectedUnit || quantity <= 0) return;

    const multiplier = getServingMultiplier(quantity, selectedUnit);
    const nutrition = {
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.macros.protein * multiplier * 10) / 10,
      carbs: Math.round(food.macros.carbs * multiplier * 10) / 10,
      fats: Math.round(food.macros.fats * multiplier * 10) / 10,
      cost: mealCalculator.calculateCostPerServing(food, quantity, selectedUnit),
    };

    setCalculatedNutrition(nutrition);
    onPortionCalculated?.(quantity, selectedUnit, nutrition);
  };

  const getServingMultiplier = (qty: number, unit: string): number => {
    const helper = portionSuggestions.find(h => 
      unit.includes(h.filipinoMeasurement) || unit.includes(h.standardServing)
    );
    return helper ? qty * helper.multiplier : qty;
  };

  const getUnitOptions = () => {
    const options = [
      { value: food.servingSize, label: food.servingSize },
    ];

    // Add Filipino portion suggestions
    portionSuggestions.forEach(helper => {
      options.push({
        value: helper.filipinoMeasurement,
        label: helper.filipinoMeasurement,
      });
    });

    // Add common units
    const commonUnits = [
      '1 piece (piraso)',
      '1 cup (tasa)',
      '1 tablespoon (kutsara)',
      '1 teaspoon (kutsarita)',
      '100 grams',
      '50 grams',
    ];

    commonUnits.forEach(unit => {
      if (!options.some(opt => opt.value === unit)) {
        options.push({ value: unit, label: unit });
      }
    });

    return options;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Portion Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Food Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium">{food.name}</h4>
          {food.nameFilipino && (
            <p className="text-sm text-gray-600">{food.nameFilipino}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Standard serving: {food.servingSize}
          </p>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            min="0.1"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            placeholder="Enter quantity"
          />
        </div>

        {/* Unit Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Unit</label>
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {getUnitOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filipino Portion Helpers */}
        {portionSuggestions.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Info className="h-4 w-4" />
              Filipino Measurements
            </label>
            <div className="space-y-2">
              {portionSuggestions.map((helper, index) => (
                <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{helper.filipinoMeasurement}</span>
                      <span className="text-gray-600 ml-2">= {helper.standardServing}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setQuantity(1);
                        setSelectedUnit(helper.filipinoMeasurement);
                      }}
                    >
                      Use
                    </Button>
                  </div>
                  <p className="text-gray-600 mt-1">{helper.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <Button 
          onClick={calculateNutrition}
          disabled={!selectedUnit || quantity <= 0}
          className="w-full"
        >
          Calculate Nutrition
        </Button>

        {/* Results */}
        {calculatedNutrition && (
          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-green-800">
              Nutrition for {quantity} {selectedUnit}
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Calories:</span>
                  <span className="font-medium">{calculatedNutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein:</span>
                  <span className="font-medium">{calculatedNutrition.protein}g</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Carbs:</span>
                  <span className="font-medium">{calculatedNutrition.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fats:</span>
                  <span className="font-medium">{calculatedNutrition.fats}g</span>
                </div>
              </div>
            </div>

            {calculatedNutrition.cost > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-green-200">
                <span className="text-sm">Estimated cost:</span>
                <Badge variant="outline" className="text-green-700">
                  ₱{calculatedNutrition.cost.toFixed(2)}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h5 className="text-sm font-medium text-yellow-800 mb-2">💡 Tips</h5>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Use familiar Filipino measurements for easier portion control</li>
            <li>• 1 tasa (rice cup) is the standard measurement in Filipino households</li>
            <li>• Costs are estimates and may vary by location and season</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}