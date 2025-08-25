'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FoodItem } from '@/types';
import { foodSearchService, FoodSearchFilters } from '@/lib/food-search';
import { FoodCard } from './FoodCard';
import { useDebounce } from '@/hooks/useDebounce';

interface FoodSearchProps {
  onFoodSelect?: (food: FoodItem) => void;
  selectedFoods?: FoodItem[];
  showSelection?: boolean;
}

const FOOD_CATEGORIES = [
  { value: 'protein', label: 'Protein' },
  { value: 'carbs', label: 'Carbohydrates' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'fats', label: 'Fats & Oils' },
  { value: 'beverages', label: 'Beverages' },
];

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast (Almusal)' },
  { value: 'lunch', label: 'Lunch (Tanghalian)' },
  { value: 'merienda', label: 'Merienda' },
  { value: 'dinner', label: 'Dinner (Hapunan)' },
];

const REGIONS = [
  { value: 'nationwide', label: 'Nationwide' },
  { value: 'luzon', label: 'Luzon' },
  { value: 'visayas', label: 'Visayas' },
  { value: 'mindanao', label: 'Mindanao' },
  { value: 'ilocos', label: 'Ilocos' },
  { value: 'bicol', label: 'Bicol' },
  { value: 'coastal', label: 'Coastal Areas' },
];

export function FoodSearch({ onFoodSelect, selectedFoods = [], showSelection = false }: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FoodSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const searchFoods = useCallback(async (query: string, currentFilters: FoodSearchFilters, currentPage: number = 1) => {
    setLoading(true);
    try {
      const result = await foodSearchService.searchFoods(query, currentFilters, currentPage, 20);
      if (currentPage === 1) {
        setFoods(result.foods);
      } else {
        setFoods(prev => [...prev, ...result.foods]);
      }
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to search foods:', error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchFoods(debouncedSearchQuery, filters, 1);
    setPage(1);
  }, [debouncedSearchQuery, filters, searchFoods]);

  const handleFilterChange = (key: keyof FoodSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchFoods(debouncedSearchQuery, filters, nextPage);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined).length;
  };

  const handleFoodSelect = (food: FoodItem) => {
    onFoodSelect?.(food);
  };

  const isSelected = (food: FoodItem) => {
    return selectedFoods.some(selected => selected.id === food.id);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search Filipino foods... (e.g., adobo, bangus, kangkong)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Foods</SheetTitle>
              <SheetDescription>
                Filter foods by category, meal type, and other preferences
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 mt-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filters.category || 'all'}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {FOOD_CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Meal Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Meal Type</label>
                <Select
                  value={filters.mealType || 'all'}
                  onValueChange={(value) => handleFilterChange('mealType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All meal types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All meal types</SelectItem>
                    {MEAL_TYPES.map(mealType => (
                      <SelectItem key={mealType.value} value={mealType.value}>
                        {mealType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select
                  value={filters.region || 'all'}
                  onValueChange={(value) => handleFilterChange('region', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {REGIONS.map(region => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Common in Philippines Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Availability</label>
                <Select
                  value={filters.commonInPhilippines === undefined ? 'all' : filters.commonInPhilippines.toString()}
                  onValueChange={(value) => handleFilterChange('commonInPhilippines', value === 'all' ? undefined : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All foods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All foods</SelectItem>
                    <SelectItem value="true">Common in Philippines</SelectItem>
                    <SelectItem value="false">Imported/Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {getActiveFiltersCount() > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary">
              Category: {FOOD_CATEGORIES.find(c => c.value === filters.category)?.label}
            </Badge>
          )}
          {filters.mealType && (
            <Badge variant="secondary">
              Meal: {MEAL_TYPES.find(m => m.value === filters.mealType)?.label}
            </Badge>
          )}
          {filters.region && (
            <Badge variant="secondary">
              Region: {REGIONS.find(r => r.value === filters.region)?.label}
            </Badge>
          )}
          {filters.commonInPhilippines !== undefined && (
            <Badge variant="secondary">
              {filters.commonInPhilippines ? 'Common in PH' : 'Imported/Special'}
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {loading ? 'Searching...' : `${totalCount} foods found`}
      </div>

      {/* Food Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {foods.map(food => (
          <FoodCard
            key={food.id}
            food={food}
            onSelect={() => handleFoodSelect(food)}
            isSelected={isSelected(food)}
            showSelection={showSelection}
          />
        ))}
      </div>

      {/* Load More */}
      {foods.length < totalCount && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* No Results */}
      {!loading && foods.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No foods found matching your search.</p>
          <p className="text-sm mt-2">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}