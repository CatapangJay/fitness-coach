import { supabase } from '@/lib/supabase';
import { FoodItem } from '@/types';

export interface FoodSearchFilters {
  category?: string;
  mealType?: string;
  maxCalories?: number;
  minProtein?: number;
  commonInPhilippines?: boolean;
  region?: string;
  season?: string;
}

export interface FoodSearchResult {
  foods: FoodItem[];
  totalCount: number;
}

export class FoodSearchService {
  private supabase = supabase;

  async searchFoods(
    query: string = '',
    filters: FoodSearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<FoodSearchResult> {
    let queryBuilder = this.supabase
      .from('filipino_foods')
      .select('*', { count: 'exact' });

    // Text search
    if (query.trim()) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,name_filipino.ilike.%${query}%`
      );
    }

    // Apply filters
    if (filters.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }

    if (filters.mealType) {
      queryBuilder = queryBuilder.contains('meal_types', [filters.mealType]);
    }

    if (filters.maxCalories) {
      queryBuilder = queryBuilder.lte('calories', filters.maxCalories);
    }

    if (filters.minProtein) {
      queryBuilder = queryBuilder.gte('protein', filters.minProtein);
    }

    if (filters.commonInPhilippines !== undefined) {
      queryBuilder = queryBuilder.eq('common_in_ph', filters.commonInPhilippines);
    }

    if (filters.region) {
      queryBuilder = queryBuilder.contains('regions', [filters.region]);
    }

    if (filters.season) {
      queryBuilder = queryBuilder.eq('season', filters.season);
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder = queryBuilder
      .range(offset, offset + limit - 1)
      .order('name');

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to search foods: ${error.message}`);
    }

    const foods: FoodItem[] = (data || []).map(food => ({
      id: food.id,
      name: food.name,
      nameFilipino: food.name_filipino,
      category: food.category,
      servingSize: food.serving_size,
      calories: food.calories,
      macros: {
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
      },
      commonInPhilippines: food.common_in_ph,
      estimatedCost: food.estimated_cost,
    }));

    return {
      foods,
      totalCount: count || 0,
    };
  }

  async getFoodById(id: string): Promise<FoodItem | null> {
    const { data, error } = await this.supabase
      .from('filipino_foods')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      nameFilipino: data.name_filipino,
      category: data.category,
      servingSize: data.serving_size,
      calories: data.calories,
      macros: {
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
      },
      commonInPhilippines: data.common_in_ph,
      estimatedCost: data.estimated_cost,
    };
  }

  async getFoodsByCategory(category: string): Promise<FoodItem[]> {
    const { data, error } = await this.supabase
      .from('filipino_foods')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) {
      throw new Error(`Failed to get foods by category: ${error.message}`);
    }

    return (data || []).map(food => ({
      id: food.id,
      name: food.name,
      nameFilipino: food.name_filipino,
      category: food.category,
      servingSize: food.serving_size,
      calories: food.calories,
      macros: {
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
      },
      commonInPhilippines: food.common_in_ph,
      estimatedCost: food.estimated_cost,
    }));
  }

  async getPopularFoods(limit: number = 10): Promise<FoodItem[]> {
    const { data, error } = await this.supabase
      .from('filipino_foods')
      .select('*')
      .eq('common_in_ph', true)
      .order('name')
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get popular foods: ${error.message}`);
    }

    return (data || []).map(food => ({
      id: food.id,
      name: food.name,
      nameFilipino: food.name_filipino,
      category: food.category,
      servingSize: food.serving_size,
      calories: food.calories,
      macros: {
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
      },
      commonInPhilippines: food.common_in_ph,
      estimatedCost: food.estimated_cost,
    }));
  }
}

export const foodSearchService = new FoodSearchService();