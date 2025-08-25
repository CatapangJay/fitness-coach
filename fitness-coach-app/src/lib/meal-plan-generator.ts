import { supabase } from '@/lib/supabase';
import { FoodItem, MealPlan, Meal, MacroBreakdown, UserProfile } from '@/types';
import { foodSearchService } from '@/lib/food-search';

export interface MealPlanOptions {
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  goal: 'bulking' | 'cutting' | 'maintain';
  preferences?: {
    avoidFoods?: string[];
    preferredFoods?: string[];
    maxCostPerDay?: number;
    vegetarian?: boolean;
  };
  language?: 'en' | 'fil';
  culturalContext?: {
    workSchedule?: 'day' | 'night' | 'flex';
    climate?: 'hot' | 'rainy' | 'cool';
    region?: string; // for future: regional availability
    budgetLevel?: 'low' | 'medium' | 'high';
  };
}

export interface MealSuggestion {
  meal: Meal;
  alternatives: FoodItem[];
  explanation: string;
}

export class MealPlanGenerator {
  private supabase = supabase;

  /**
   * Generate a complete meal plan for a user
   */
  async generateMealPlan(
    userId: string,
    profile: UserProfile,
    date: Date = new Date(),
    overrides?: Partial<MealPlanOptions>
  ): Promise<MealPlan> {
    const base: MealPlanOptions = {
      targetCalories: profile.targetCalories || 2000,
      targetMacros: {
        protein: profile.proteinGrams || 150,
        carbs: profile.carbsGrams || 200,
        fats: profile.fatsGrams || 65,
      },
      goal: profile.goal,
      language: (profile as any).language === 'fil' ? 'fil' : 'en',
      culturalContext: {
        // sensible PH defaults; can be overridden later by user settings
        workSchedule: 'day',
        climate: 'hot',
        budgetLevel: 'medium',
      },
    };
    
    const options: MealPlanOptions = {
      ...base,
      ...overrides,
      targetMacros: { ...base.targetMacros, ...(overrides?.targetMacros || {}) },
      culturalContext: { ...base.culturalContext, ...(overrides?.culturalContext || {}) },
      language: overrides?.language ?? base.language,
    };

    // Generate meals for traditional Filipino meal times
    const meals = await Promise.all([
      this.generateMeal('breakfast', options, 0.25), // 25% of daily calories
      this.generateMeal('lunch', options, 0.35),     // 35% of daily calories
      this.generateMeal('merienda', options, 0.15),  // 15% of daily calories
      this.generateMeal('dinner', options, 0.25),    // 25% of daily calories
    ]);

    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalMacros = meals.reduce(
      (sum, meal) => ({
        protein: sum.protein + meal.macros.protein,
        carbs: sum.carbs + meal.macros.carbs,
        fats: sum.fats + meal.macros.fats,
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );

    return {
      id: crypto.randomUUID(),
      userId,
      date,
      meals,
      totalCalories,
      totalMacros,
    };
  }

  /**
   * Generate a single meal based on meal type and calorie allocation
   */
  private async generateMeal(
    mealType: 'breakfast' | 'lunch' | 'merienda' | 'dinner',
    options: MealPlanOptions,
    calorieRatio: number
  ): Promise<Meal> {
    const targetCalories = options.targetCalories * calorieRatio;
    const targetProtein = options.targetMacros.protein * calorieRatio;
    const targetCarbs = options.targetMacros.carbs * calorieRatio;
    const targetFats = options.targetMacros.fats * calorieRatio;

    // Get meal-specific food suggestions
    const foods = await this.getMealSpecificFoods(mealType, targetCalories, options.goal);
    
    // Select foods to meet macro targets
    const selectedFoods = this.selectFoodsForMacros(
      foods,
      targetCalories,
      { protein: targetProtein, carbs: targetCarbs, fats: targetFats }
    );

    const calories = selectedFoods.reduce((sum, food) => sum + food.calories, 0);
    const macros = selectedFoods.reduce(
      (sum, food) => ({
        protein: sum.protein + food.macros.protein,
        carbs: sum.carbs + food.macros.carbs,
        fats: sum.fats + food.macros.fats,
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );

    return {
      type: mealType,
      foods: selectedFoods,
      calories,
      macros,
    };
  }

  /**
   * Get foods appropriate for specific meal types with Filipino context
   */
  private async getMealSpecificFoods(
    mealType: string,
    targetCalories: number,
    goal: string
  ): Promise<FoodItem[]> {
    const filipinoMealPatterns = {
      breakfast: {
        categories: ['grains', 'protein', 'dairy', 'fruits'],
        commonFoods: ['rice', 'egg', 'milk', 'banana', 'bread', 'oatmeal', 'pandesal', 'longganisa', 'tocino'],
        description: 'Traditional Filipino breakfast with rice, protein, and fruits',
        culturalNotes: 'Filipinos often eat rice for breakfast with fried eggs and meat'
      },
      lunch: {
        categories: ['protein', 'grains', 'vegetables', 'fats'],
        commonFoods: ['rice', 'chicken', 'fish', 'vegetables', 'adobo', 'sinigang', 'bangus', 'pork', 'beef'],
        description: 'Main meal with rice, ulam (viand), and vegetables',
        culturalNotes: 'Lunch is the biggest meal, typically with rice and a protein-rich ulam'
      },
      merienda: {
        categories: ['snacks', 'fruits', 'dairy', 'sweets'],
        commonFoods: ['banana', 'crackers', 'nuts', 'yogurt', 'biscuits', 'halo-halo', 'turon', 'bibingka'],
        description: 'Light afternoon snack, often sweet or refreshing',
        culturalNotes: 'Merienda bridges lunch and dinner, often includes local delicacies'
      },
      dinner: {
        categories: ['protein', 'vegetables', 'grains', 'soup'],
        commonFoods: ['fish', 'vegetables', 'rice', 'soup', 'chicken', 'tinola', 'nilaga', 'pakbet'],
        description: 'Evening meal, often lighter than lunch with soup',
        culturalNotes: 'Dinner often includes sabaw (soup) and is eaten with family'
      },
    };

    const mealConfig = filipinoMealPatterns[mealType as keyof typeof filipinoMealPatterns];
    const allFoods: FoodItem[] = [];

    // Get foods from each category with preference for Filipino foods
    for (const category of mealConfig.categories) {
      try {
        const categoryFoods = await foodSearchService.getFoodsByCategory(category);
        allFoods.push(...categoryFoods);
      } catch (error) {
        console.warn(`Failed to get foods for category ${category}:`, error);
      }
    }

    // Prioritize Filipino foods and common meal foods
    const filipinoFoods = allFoods.filter(food => food.commonInPhilippines);
    const commonMealFoods = allFoods.filter(food => 
      mealConfig.commonFoods.some(common => 
        food.name.toLowerCase().includes(common.toLowerCase())
      )
    );

    // Combine and deduplicate
    const prioritizedFoods = [...new Set([...commonMealFoods, ...filipinoFoods])];
    
    // If we don't have enough Filipino foods, include all foods
    return prioritizedFoods.length > 10 ? prioritizedFoods : allFoods;
  }

  /**
   * Select foods to meet macro targets using a simple algorithm
   */
  private selectFoodsForMacros(
    availableFoods: FoodItem[],
    targetCalories: number,
    targetMacros: MacroBreakdown
  ): FoodItem[] {
    const selectedFoods: FoodItem[] = [];
    let currentCalories = 0;
    let currentMacros = { protein: 0, carbs: 0, fats: 0 };

    // Sort foods by macro density for better selection
    const proteinFoods = availableFoods
      .filter(food => food.macros.protein > 10)
      .sort((a, b) => (b.macros.protein / b.calories) - (a.macros.protein / a.calories));

    const carbFoods = availableFoods
      .filter(food => food.macros.carbs > 15)
      .sort((a, b) => (b.macros.carbs / b.calories) - (a.macros.carbs / a.calories));

    const fatFoods = availableFoods
      .filter(food => food.macros.fats > 5)
      .sort((a, b) => (b.macros.fats / b.calories) - (a.macros.fats / a.calories));

    // Add primary protein source
    if (proteinFoods.length > 0 && currentCalories < targetCalories * 0.8) {
      const proteinFood = proteinFoods[0];
      selectedFoods.push(proteinFood);
      currentCalories += proteinFood.calories;
      currentMacros.protein += proteinFood.macros.protein;
      currentMacros.carbs += proteinFood.macros.carbs;
      currentMacros.fats += proteinFood.macros.fats;
    }

    // Add primary carb source
    if (carbFoods.length > 0 && currentCalories < targetCalories * 0.8) {
      const carbFood = carbFoods[0];
      selectedFoods.push(carbFood);
      currentCalories += carbFood.calories;
      currentMacros.protein += carbFood.macros.protein;
      currentMacros.carbs += carbFood.macros.carbs;
      currentMacros.fats += carbFood.macros.fats;
    }

    // Add fat source if needed
    if (currentMacros.fats < targetMacros.fats * 0.7 && fatFoods.length > 0) {
      const fatFood = fatFoods[0];
      if (currentCalories + fatFood.calories <= targetCalories * 1.1) {
        selectedFoods.push(fatFood);
        currentCalories += fatFood.calories;
        currentMacros.protein += fatFood.macros.protein;
        currentMacros.carbs += fatFood.macros.carbs;
        currentMacros.fats += fatFood.macros.fats;
      }
    }

    // Fill remaining calories with balanced foods
    const remainingFoods = availableFoods.filter(
      food => !selectedFoods.some(selected => selected.id === food.id)
    );

    for (const food of remainingFoods) {
      if (currentCalories + food.calories <= targetCalories * 1.1 && selectedFoods.length < 5) {
        selectedFoods.push(food);
        currentCalories += food.calories;
        currentMacros.protein += food.macros.protein;
        currentMacros.carbs += food.macros.carbs;
        currentMacros.fats += food.macros.fats;
      }
    }

    return selectedFoods;
  }

  /**
   * Generate meal suggestions with alternatives
   */
  async generateMealSuggestions(
    mealType: 'breakfast' | 'lunch' | 'merienda' | 'dinner',
    options: MealPlanOptions
  ): Promise<MealSuggestion[]> {
    const calorieRatios = {
      breakfast: 0.25,
      lunch: 0.35,
      merienda: 0.15,
      dinner: 0.25,
    };

    const targetCalories = options.targetCalories * calorieRatios[mealType];
    const foods = await this.getMealSpecificFoods(mealType, targetCalories, options.goal);

    // Generate 3 different meal suggestions
    const suggestions: MealSuggestion[] = [];

    for (let i = 0; i < 3; i++) {
      const shuffledFoods = [...foods].sort(() => Math.random() - 0.5);
      const meal = await this.generateMeal(mealType, options, calorieRatios[mealType]);
      
      // Get alternatives for each food in the meal
      const alternatives: FoodItem[] = [];
      for (const food of meal.foods) {
        const similarFoods = shuffledFoods
          .filter(f => f.category === food.category && f.id !== food.id)
          .slice(0, 2);
        alternatives.push(...similarFoods);
      }

      let explanation = this.generateMealExplanation(meal, options.goal, options.language ?? 'en');
      explanation += ' ' + this.generateContextNotes(meal.type, options);

      suggestions.push({
        meal,
        alternatives,
        explanation,
      });
    }

    return suggestions;
  }

  /**
   * Generate culturally relevant explanation for meal choices
   */
  private generateMealExplanation(meal: Meal, goal: string, language: 'en' | 'fil' = 'en'): string {
    const filipinoMealExplanations = {
      bulking: {
        breakfast: "Masustansyang almusal na may rice, itlog, at prutas para sa muscle-building. Perfect para sa mga Pinoy na gusto mag-gain ng muscle mass.",
        lunch: "Malaking tanghalian na may rice at ulam na puno ng protein. Suportahan ang muscle growth habang nakakain ng pamilyar na pagkain.",
        merienda: "Matamis o maalat na merienda para sa extra calories. Pwedeng turon, banana cue, o nuts para sa energy boost.",
        dinner: "Balanced na hapunan na may sabaw at gulay. Magbibigay ng nutrients para sa muscle recovery habang natutulog.",
      },
      cutting: {
        breakfast: "Light pero filling na almusal na may protein. Iwas sa sobrang rice, dagdag sa itlog at gulay para sa satiety.",
        lunch: "Lean protein na ulam na may konting rice lang. Maraming gulay para mabusog ka nang hindi sobrang calories.",
        merienda: "Light snack lang - pwedeng prutas o yogurt. Iwas sa matamis na kakanin para sa fat loss goals.",
        dinner: "Magaan na hapunan na may maraming sabaw at gulay. Konting rice lang para sa calorie deficit.",
      },
      maintain: {
        breakfast: "Balanced na almusal na kasama ang rice, protein, at prutas. Sakto lang para sa daily energy needs.",
        lunch: "Normal na tanghalian na may rice at ulam. Balanced macros para sa sustained energy buong araw.",
        merienda: "Moderate na snack para hindi ka magutom. Pwedeng local delicacies pero hindi sobra.",
        dinner: "Kaswal na hapunan na may sabaw. Kumpleto ang nutrients para sa araw na ito.",
      },
    };

    const englishExplanations = {
      bulking: {
        breakfast: "High-calorie Filipino breakfast with rice, eggs, and fruits to fuel muscle-building goals. Traditional foods that support your gains.",
        lunch: "Protein-rich lunch with rice and ulam (viand) to support muscle growth. Familiar Filipino flavors with optimal nutrition.",
        merienda: "Energy-dense Filipino snacks to maintain caloric surplus. Try turon, banana cue, or nuts for extra calories.",
        dinner: "Balanced dinner with sabaw (soup) and vegetables for overnight muscle repair. Complete nutrition in familiar flavors.",
      },
      cutting: {
        breakfast: "Protein-focused Filipino breakfast with less rice, more eggs and vegetables. Satisfying while supporting fat loss.",
        lunch: "Lean protein ulam with moderate rice and lots of vegetables. Filipino comfort food optimized for weight loss.",
        merienda: "Light Filipino snacks like fresh fruits or yogurt. Avoid heavy kakanin to support your cutting goals.",
        dinner: "Light dinner with plenty of sabaw and vegetables. Minimal rice to maintain calorie deficit while staying satisfied.",
      },
      maintain: {
        breakfast: "Balanced Filipino breakfast with rice, protein, and fruits. Perfect portions for maintaining your current weight.",
        lunch: "Traditional lunch with rice and ulam. Balanced macros in familiar Filipino meal patterns.",
        merienda: "Moderate Filipino snacks to bridge meals. Enjoy local delicacies in reasonable portions.",
        dinner: "Casual dinner with sabaw and vegetables. Complete daily nutrition with traditional Filipino flavors.",
      },
    };

    const maps = language === 'fil' ? filipinoMealExplanations : englishExplanations;
    return maps[goal as keyof typeof maps][meal.type] ||
      (language === 'fil'
        ? 'Balanseng pagkaing Pilipino na tumutugma sa iyong layunin gamit ang pamilyar na lasa.'
        : 'Balanced Filipino meal designed to meet your nutritional goals with familiar local flavors.');
  }

  /**
   * Get recommended meal times based on Filipino work schedules
   */
  public getRecommendedMealTimes(
    workSchedule: 'day' | 'night' | 'flex' = 'day',
    date: Date = new Date()
  ): Record<'breakfast' | 'lunch' | 'merienda' | 'dinner', string> {
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (h: number, m: number) => `${pad(h)}:${pad(m)}`;

    if (workSchedule === 'night') {
      return {
        breakfast: fmt(18, 30),
        lunch: fmt(0, 0),
        merienda: fmt(3, 0),
        dinner: fmt(8, 0),
      };
    }

    if (workSchedule === 'flex') {
      const now = date;
      const baseHour = now.getHours();
      const start = baseHour < 10 ? 8 : Math.min(10, baseHour + 1);
      return {
        breakfast: fmt(start, 0),
        lunch: fmt((start + 4) % 24, 0),
        merienda: fmt((start + 7) % 24, 30),
        dinner: fmt((start + 11) % 24, 0),
      };
    }

    return {
      breakfast: fmt(7, 0),
      lunch: fmt(12, 0),
      merienda: fmt(15, 30),
      dinner: fmt(19, 0),
    };
  }

  /**
   * Climate/work-schedule notes appended to explanations, language-aware
   */
  private generateContextNotes(
    mealType: 'breakfast' | 'lunch' | 'merienda' | 'dinner',
    options: MealPlanOptions
  ): string {
    const lang = options.language ?? 'en';
    const work = options.culturalContext?.workSchedule ?? 'day';
    const climate = options.culturalContext?.climate ?? 'hot';

    const notes: string[] = [];

    if (work === 'night') {
      notes.push(
        lang === 'fil'
          ? 'Inangkop ang oras ng kainan para sa night shift (hal., midnight meal at maagang merienda).'
          : 'Meal times adapted for night-shift schedule (e.g., midnight meal and early-morning merienda).'
      );
    }

    if (climate === 'hot') {
      notes.push(
        lang === 'fil'
          ? 'Mag-hydrate lalo na sa tanghali; pumili ng mas sabaw/prutas sa merienda para presko.'
          : 'Hydrate more around midday; consider more soups/fruits for a refreshing merienda.'
      );
    } else if (climate === 'rainy') {
      notes.push(
        lang === 'fil'
          ? 'Sa tag-ulan, mas mainit na ulam at sabaw ang inirerekomenda para sa comfort.'
          : 'During rainy days, warmer dishes and soups provide comfort and satiety.'
      );
    }

    return notes.join(' ');
  }

  /**
   * Save meal plan to database
   */
  async saveMealPlan(mealPlan: MealPlan): Promise<void> {
    const { error } = await this.supabase
      .from('meal_plans')
      .insert({
        id: mealPlan.id,
        user_id: mealPlan.userId,
        date: mealPlan.date.toISOString().split('T')[0],
        meals: mealPlan.meals,
        total_calories: mealPlan.totalCalories,
        total_macros: mealPlan.totalMacros,
      });

    if (error) {
      throw new Error(`Failed to save meal plan: ${error.message}`);
    }
  }

  /**
   * Get saved meal plan for a specific date
   */
  async getMealPlan(userId: string, date: Date): Promise<MealPlan | null> {
    const dateString = date.toISOString().split('T')[0];
    
    const { data, error } = await this.supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateString)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      date: new Date(data.date),
      meals: data.meals,
      totalCalories: data.total_calories,
      totalMacros: data.total_macros,
    };
  }
}

export const mealPlanGenerator = new MealPlanGenerator();