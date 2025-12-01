import { NutrientFilterOptions } from '@/services/recipeService';

export type FilterChip = {
  id: string;
  label: string;
  type: 'ingredients' | 'cuisine' | 'nutrient';
  filterKey?: string; // For nutrient filters
};

export const NUTRIENT_FILTERS = [
  { label: 'Calories', unit: '', minKey: 'minCalories' as const, maxKey: 'maxCalories' as const },
  { label: 'Carbs', unit: 'g', minKey: 'minCarbs' as const, maxKey: 'maxCarbs' as const },
  { label: 'Protein', unit: 'g', minKey: 'minProtein' as const, maxKey: 'maxProtein' as const },
  { label: 'Fat', unit: 'g', minKey: 'minFat' as const, maxKey: 'maxFat' as const },
  { label: 'Fiber', unit: 'g', minKey: 'minFiber' as const, maxKey: 'maxFiber' as const },
  { label: 'Sugar', unit: 'g', minKey: 'minSugar' as const, maxKey: 'maxSugar' as const },
  { label: 'Sodium', unit: 'mg', minKey: 'minSodium' as const, maxKey: 'maxSodium' as const },
] as const;

/**
 * Generates an array of filter chips based on the current filter state
 */
export function getActiveFilterChips(
  ingredients: string,
  selectedCuisine: string,
  nutrientFilter: NutrientFilterOptions,
): FilterChip[] {
  const chips: FilterChip[] = [];
  
  // Add manual ingredients chip (only if there are manual ingredients)
  if (ingredients.trim()) {
    chips.push({
      id: 'ingredients',
      label: `Ingredients: ${ingredients.trim()}`,
      type: 'ingredients',
    });
  }
  
  if (selectedCuisine) {
    chips.push({
      id: 'cuisine',
      label: `Cuisine: ${selectedCuisine.replace('_', ' ')}`,
      type: 'cuisine',
    });
  }
  
  // Add nutrient filters
  NUTRIENT_FILTERS.forEach((nutrient) => {
    const minValue = nutrientFilter[nutrient.minKey];
    const maxValue = nutrientFilter[nutrient.maxKey];
    
    if (minValue !== undefined || maxValue !== undefined) {
      let label = `${nutrient.label}: `;
      if (minValue !== undefined && maxValue !== undefined) {
        label += `${minValue}-${maxValue}${nutrient.unit}`;
      } else if (minValue !== undefined) {
        label += `≥${minValue}${nutrient.unit}`;
      } else {
        label += `≤${maxValue}${nutrient.unit}`;
      }
      
      chips.push({
        id: `nutrient-${nutrient.minKey}`,
        label,
        type: 'nutrient',
        filterKey: nutrient.minKey,
      });
    }
  });
  
  return chips;
}

