import { FoodItem, MacroBreakdown } from '@/types';

export interface MealFoodItem extends FoodItem {
  quantity: number;
  unit: string;
}

export interface MealComposition {
  totalCalories: number;
  totalMacros: MacroBreakdown;
  foods: MealFoodItem[];
  estimatedCost: number;
}

export interface PortionHelper {
  food: string;
  filipinoMeasurement: string;
  standardServing: string;
  multiplier: number;
  description: string;
}

// Filipino portion size helpers
export const FILIPINO_PORTION_HELPERS: PortionHelper[] = [
  {
    food: 'rice',
    filipinoMeasurement: '1 tasa (rice cup)',
    standardServing: '1 cup cooked',
    multiplier: 1,
    description: 'Standard rice cup used in Filipino households'
  },
  {
    food: 'rice',
    filipinoMeasurement: '1 kutsara (tablespoon)',
    standardServing: '1 cup cooked',
    multiplier: 0.0625,
    description: 'One tablespoon of cooked rice'
  },
  {
    food: 'fish',
    filipinoMeasurement: '1 piraso (piece)',
    standardServing: '100g',
    multiplier: 1,
    description: 'One medium-sized piece of fish'
  },
  {
    food: 'chicken',
    filipinoMeasurement: '1 piraso (piece)',
    standardServing: '100g',
    multiplier: 1,
    description: 'One piece of chicken (thigh or breast)'
  },
  {
    food: 'egg',
    filipinoMeasurement: '1 itlog',
    standardServing: '1 large egg',
    multiplier: 1,
    description: 'One whole egg'
  },
  {
    food: 'vegetables',
    filipinoMeasurement: '1 tasa',
    standardServing: '1 cup',
    multiplier: 1,
    description: 'One cup of vegetables'
  },
  {
    food: 'oil',
    filipinoMeasurement: '1 kutsarita (teaspoon)',
    standardServing: '1 tablespoon',
    multiplier: 0.33,
    description: 'One teaspoon of cooking oil'
  },
  {
    food: 'oil',
    filipinoMeasurement: '1 kutsara (tablespoon)',
    standardServing: '1 tablespoon',
    multiplier: 1,
    description: 'One tablespoon of cooking oil'
  }
];

export class MealCalculator {
  /**
   * Calculate total nutrition for a meal with multiple foods
   */
  calculateMealComposition(foods: MealFoodItem[]): MealComposition {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let estimatedCost = 0;

    foods.forEach(food => {
      const multiplier = this.getServingMultiplier(food.quantity, food.unit, food.servingSize);
      
      totalCalories += food.calories * multiplier;
      totalProtein += food.macros.protein * multiplier;
      totalCarbs += food.macros.carbs * multiplier;
      totalFats += food.macros.fats * multiplier;
      
      if (food.estimatedCost) {
        estimatedCost += food.estimatedCost * multiplier;
      }
    });

    return {
      totalCalories: Math.round(totalCalories),
      totalMacros: {
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        fats: Math.round(totalFats * 10) / 10,
      },
      foods,
      estimatedCost: Math.round(estimatedCost * 100) / 100,
    };
  }

  /**
   * Calculate serving multiplier based on quantity and unit
   */
  private getServingMultiplier(quantity: number, unit: string, standardServing: string): number {
    // Handle common Filipino measurements
    const filipinoHelper = FILIPINO_PORTION_HELPERS.find(helper => 
      unit.toLowerCase().includes(helper.filipinoMeasurement.toLowerCase()) ||
      unit.toLowerCase().includes(helper.filipinoMeasurement.split(' ')[1]?.toLowerCase() || '')
    );

    if (filipinoHelper) {
      return quantity * filipinoHelper.multiplier;
    }

    // Handle standard measurements
    if (unit.toLowerCase().includes('cup') && standardServing.toLowerCase().includes('cup')) {
      return quantity;
    }

    if (unit.toLowerCase().includes('piece') || unit.toLowerCase().includes('piraso')) {
      return quantity;
    }

    if (unit.toLowerCase().includes('gram') || unit.toLowerCase().includes('g')) {
      // Extract grams from standard serving (e.g., "100g" -> 100)
      const servingGrams = this.extractGramsFromServing(standardServing);
      if (servingGrams > 0) {
        return quantity / servingGrams;
      }
    }

    // Default to 1:1 ratio if we can't determine
    return quantity;
  }

  /**
   * Extract grams from serving size string
   */
  private extractGramsFromServing(serving: string): number {
    const match = serving.match(/(\d+)\s*g/i);
    return match ? parseInt(match[1]) : 100; // Default to 100g if not found
  }

  /**
   * Get portion size suggestions for a food item
   */
  getPortionSuggestions(food: FoodItem): PortionHelper[] {
    const category = food.category.toLowerCase();
    const name = food.name.toLowerCase();

    return FILIPINO_PORTION_HELPERS.filter(helper => {
      if (name.includes('rice') || name.includes('bigas')) {
        return helper.food === 'rice';
      }
      if (name.includes('fish') || name.includes('bangus') || name.includes('tilapia')) {
        return helper.food === 'fish';
      }
      if (name.includes('chicken') || name.includes('manok')) {
        return helper.food === 'chicken';
      }
      if (name.includes('egg') || name.includes('itlog')) {
        return helper.food === 'egg';
      }
      if (name.includes('oil') || name.includes('langis')) {
        return helper.food === 'oil';
      }
      if (category === 'vegetables') {
        return helper.food === 'vegetables';
      }
      return false;
    });
  }

  /**
   * Convert between metric and imperial measurements
   */
  convertMeasurement(value: number, fromUnit: string, toUnit: string): number {
    const conversions: { [key: string]: { [key: string]: number } } = {
      'g': { 'oz': 0.035274, 'lb': 0.00220462 },
      'oz': { 'g': 28.3495, 'lb': 0.0625 },
      'lb': { 'g': 453.592, 'oz': 16 },
      'ml': { 'fl oz': 0.033814, 'cup': 0.00422675 },
      'fl oz': { 'ml': 29.5735, 'cup': 0.125 },
      'cup': { 'ml': 236.588, 'fl oz': 8 },
    };

    const fromKey = fromUnit.toLowerCase();
    const toKey = toUnit.toLowerCase();

    if (conversions[fromKey] && conversions[fromKey][toKey]) {
      return value * conversions[fromKey][toKey];
    }

    return value; // Return original value if conversion not found
  }

  /**
   * Calculate cost per serving in PHP
   */
  calculateCostPerServing(food: FoodItem, quantity: number, unit: string): number {
    if (!food.estimatedCost) return 0;

    const multiplier = this.getServingMultiplier(quantity, unit, food.servingSize);
    return Math.round(food.estimatedCost * multiplier * 100) / 100;
  }

  /**
   * Get meal timing suggestions based on Filipino eating patterns
   */
  getMealTimingSuggestions(): { [key: string]: string } {
    return {
      breakfast: '6:00 AM - 8:00 AM (Almusal)',
      lunch: '12:00 PM - 1:00 PM (Tanghalian)',
      merienda: '3:00 PM - 4:00 PM (Merienda)',
      dinner: '6:00 PM - 8:00 PM (Hapunan)',
    };
  }
}

export const mealCalculator = new MealCalculator();