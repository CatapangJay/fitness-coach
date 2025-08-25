'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Dumbbell, 
  Target, 
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { Exercise } from '@/types';
import { exerciseService, ExerciseFilters } from '@/lib/exercise-service';
import { ExerciseCard } from './ExerciseCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExerciseSearchProps {
  onExerciseSelect?: (exercise: Exercise) => void;
  initialFilters?: ExerciseFilters;
  showSelection?: boolean;
  selectedExercises?: Exercise[];
}

export function ExerciseSearch({ 
  onExerciseSelect, 
  initialFilters = {},
  showSelection = false,
  selectedExercises = []
}: ExerciseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ExerciseFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Load available muscle groups and equipment types
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [muscleGroupsData, equipmentData] = await Promise.all([
          exerciseService.getMuscleGroups(),
          exerciseService.getEquipmentTypes(),
        ]);
        setMuscleGroups(muscleGroupsData);
        setEquipmentTypes(equipmentData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Search exercises
  const searchExercises = useCallback(async (resetPage = true) => {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const searchFilters = {
        ...filters,
        searchQuery: searchQuery.trim() || undefined,
      };

      const result = await exerciseService.searchExercises(searchFilters, currentPage, 20);
      
      if (resetPage) {
        setExercises(result.exercises);
        setPage(1);
      } else {
        setExercises(prev => [...prev, ...result.exercises]);
      }
      
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to search exercises:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, page]);

  // Initial search
  useEffect(() => {
    searchExercises(true);
  }, [searchQuery, filters]);

  const handleFilterChange = (key: keyof ExerciseFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMuscleGroupToggle = (muscleGroup: string) => {
    const currentGroups = filters.muscleGroups || [];
    const newGroups = currentGroups.includes(muscleGroup)
      ? currentGroups.filter(g => g !== muscleGroup)
      : [...currentGroups, muscleGroup];
    
    handleFilterChange('muscleGroups', newGroups.length > 0 ? newGroups : undefined);
  };

  const handleEquipmentToggle = (equipment: string) => {
    const currentEquipment = filters.equipment || [];
    const newEquipment = currentEquipment.includes(equipment)
      ? currentEquipment.filter(e => e !== equipment)
      : [...currentEquipment, equipment];
    
    handleFilterChange('equipment', newEquipment.length > 0 ? newEquipment : undefined);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    searchExercises(false);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.difficulty) count++;
    if (filters.muscleGroups?.length) count++;
    if (filters.equipment?.length) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search exercises (e.g., push-up, squat, dumbbell)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFilterCount()}
                </Badge>
              )}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={filters.category || ''}
                    onValueChange={(value) => handleFilterChange('category', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      <SelectItem value="strength">💪 Strength</SelectItem>
                      <SelectItem value="cardio">❤️ Cardio</SelectItem>
                      <SelectItem value="flexibility">🤸 Flexibility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select
                    value={filters.difficulty || ''}
                    onValueChange={(value) => handleFilterChange('difficulty', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All levels</SelectItem>
                      <SelectItem value="beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                      <SelectItem value="advanced">🔴 Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Muscle Groups */}
              <div>
                <label className="text-sm font-medium mb-2 block">Muscle Groups</label>
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map((group) => (
                    <Badge
                      key={group}
                      variant={filters.muscleGroups?.includes(group) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleMuscleGroupToggle(group)}
                    >
                      {group.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="text-sm font-medium mb-2 block">Equipment</label>
                <div className="flex flex-wrap gap-2">
                  {equipmentTypes.map((equipment) => (
                    <Badge
                      key={equipment}
                      variant={filters.equipment?.includes(equipment) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleEquipmentToggle(equipment)}
                    >
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {loading ? 'Searching...' : `${totalCount} exercises found`}
        </span>
        {showSelection && selectedExercises.length > 0 && (
          <span>{selectedExercises.length} selected</span>
        )}
      </div>

      {/* Exercise Results */}
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSelect={onExerciseSelect}
            isSelected={selectedExercises.some(e => e.id === exercise.id)}
            showSelection={showSelection}
          />
        ))}

        {loading && exercises.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading exercises...</span>
          </div>
        )}

        {!loading && exercises.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No exercises found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find exercises.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {hasMore && exercises.length > 0 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading more...
                </>
              ) : (
                'Load More Exercises'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}