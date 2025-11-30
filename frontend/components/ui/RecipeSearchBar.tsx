import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors, Palette } from '@/constants/theme';
import { NutrientFilterOptions } from '@/services/recipeService';
import { useRecipes } from '@/context/RecipeContext';
import { FilterChip, getActiveFilterChips, NUTRIENT_FILTERS } from '@/utils/filterChipUtils';
import { FilterChipsDisplay } from './FilterChipsDisplay';

type SearchOptions = {
  query?: string;
  ingredients?: string;
  cuisine?: string;
  number?: number;
  nutrientFilter?: NutrientFilterOptions;
};

type Props = {
  onSearch: (options: SearchOptions) => void;
};

const CUISINES = [
  'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean',
  'Chinese', 'Eastern_European', 'European', 'French', 'German', 'Greek',
  'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean',
  'Latin_American', 'Mediterranean', 'Mexican', 'Middle_Eastern', 'Nordic',
  'Southern', 'Spanish', 'Thai', 'Vietnamese'
];

export function RecipeSearchBar({ onSearch }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [nutrientFilter, setNutrientFilter] = useState<NutrientFilterOptions>({});
  const [isFocused, setIsFocused] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { loading } = useRecipes();

  // Hide the search bar until the recipes are loaded on startup, then always show it
  useEffect(() => {
    if (!loading) {
      setInitialLoading(false);
    }
  }, [loading]);
  
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');
  const colorScheme = useColorScheme() || 'light';

  const handleSearch = () => {
    // Only include non-empty values in the search options
    const searchOptions: SearchOptions = {
      query: searchQuery.trim() || undefined,
      ingredients: ingredients.trim() || undefined,
      cuisine: selectedCuisine || undefined,
      nutrientFilter: Object.keys(nutrientFilter).length > 0 ? nutrientFilter : undefined,
    };
    onSearch(searchOptions);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setIngredients('');
    setSelectedCuisine('');
    setNutrientFilter({});
  };

  // Helper function to update nutrient filter values
  const updateNutrientFilter = (key: keyof NutrientFilterOptions, value: string) => {
    const numValue = value === '' ? undefined : parseInt(value, 10);
    if (numValue !== undefined && isNaN(numValue)) return; // Don't update if invalid number
    
    setNutrientFilter(prev => {
      const updated = { ...prev };
      if (numValue === undefined) {
        delete updated[key];
      } else {
        updated[key] = numValue;
      }
      // Remove empty object if no filters are set
      return Object.keys(updated).length === 0 ? {} : updated;
    });
  };

  const handleClear = () => {
    clearFilters();
    // Trigger search with no options to reset to random recipes
    onSearch({
      query: undefined,
      ingredients: undefined,
      cuisine: undefined,
      nutrientFilter: undefined,
    });
  };

  const hasActiveFilters = searchQuery || ingredients || selectedCuisine || Object.keys(nutrientFilter).length > 0;

  // Remove a specific filter and trigger search
  const removeFilter = (chip: FilterChip) => {
    switch (chip.type) {
      case 'ingredients':
        setIngredients('');
        break;
      case 'cuisine':
        setSelectedCuisine('');
        break;
      case 'nutrient':
        if (chip.filterKey) {
          const nutrient = NUTRIENT_FILTERS.find(n => n.minKey === chip.filterKey || n.maxKey === chip.filterKey);
          if (nutrient) {
            setNutrientFilter(prev => {
              const updated = { ...prev };
              delete updated[nutrient.minKey];
              delete updated[nutrient.maxKey];
              return Object.keys(updated).length === 0 ? {} : updated;
            });
          }
        }
        break;
    }
    
    // Trigger search with updated filters
    const updatedOptions: SearchOptions = {
      ingredients: chip.type === 'ingredients' ? undefined : (ingredients.trim() || undefined),
      cuisine: chip.type === 'cuisine' ? undefined : (selectedCuisine || undefined),
      nutrientFilter: chip.type === 'nutrient' && chip.filterKey
        ? (() => {
            const nutrient = NUTRIENT_FILTERS.find(n => n.minKey === chip.filterKey || n.maxKey === chip.filterKey);
            if (nutrient) {
              const updated = { ...nutrientFilter };
              delete updated[nutrient.minKey];
              delete updated[nutrient.maxKey];
              return Object.keys(updated).length > 0 ? updated : undefined;
            }
            return Object.keys(nutrientFilter).length > 0 ? nutrientFilter : undefined;
          })()
        : (Object.keys(nutrientFilter).length > 0 ? nutrientFilter : undefined),
    };
    
    onSearch(updatedOptions);
  };

  return (
    <View style={styles.container}>
      {/* Main Search Bar */}
      <View style={[styles.searchBar, initialLoading ? { opacity: 0 } : { opacity: 1 }, { 
        backgroundColor: bg, 
        borderColor: isFocused ? Colors[colorScheme].tint : icon + '90',
        borderWidth: isFocused ? 2 : 1,
      }]}>
        <TouchableOpacity
          onPress={handleSearch}
          style={styles.searchBarButton}
        >
          <AntDesign name="search" size={20} color={icon} style={styles.searchIcon} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: text, outlineWidth: 0, outlineColor: 'transparent' }]}
          placeholder="Search recipes..."
          placeholderTextColor={icon + '90'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={styles.searchBarButton}
        >
          <AntDesign name="filter" size={20} color={icon} />
        </TouchableOpacity>
        {hasActiveFilters ? (
          <TouchableOpacity onPress={handleClear} style={styles.searchBarButton}>
            <AntDesign name="close-circle" size={18} color={icon} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <FilterChipsDisplay
          chips={getActiveFilterChips(ingredients, selectedCuisine, nutrientFilter)}
          onRemove={removeFilter}
        />
      )}

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="title">Advanced Search</ThemedText>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <AntDesign name="close" size={24} color={icon} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Search Query Input */}
              <View style={styles.filterSection}>
                <ThemedText type="subtitle" style={styles.label}>
                  Search Query
                </ThemedText>
                <TextInput
                  style={[styles.filterInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                  placeholder="Search recipes..."
                  placeholderTextColor={icon + '80'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Ingredients Input */}
              <View style={styles.filterSection}>
                <ThemedText type="subtitle" style={styles.label}>
                  Ingredients (comma-separated)
                </ThemedText>
                <TextInput
                  style={[styles.filterInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                  placeholder="e.g., chicken, tomatoes, garlic"
                  placeholderTextColor={icon + '80'}
                  value={ingredients}
                  onChangeText={setIngredients}
                />
              </View>

              {/* Cuisine Picker */}
              <View style={styles.filterSection}>
                <ThemedText type="subtitle" style={styles.label}>
                  Cuisine
                </ThemedText>
                <View style={styles.cuisineContainer}>
                  {CUISINES.map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      onPress={() => setSelectedCuisine(
                        selectedCuisine === cuisine ? '' : cuisine
                      )}
                      style={[
                        styles.cuisineChip,
                        {
                          backgroundColor: selectedCuisine === cuisine
                            ? Colors[colorScheme].tint
                            : bg,
                          borderColor: icon + '33',
                        },
                      ]}
                    >
                      <ThemedText
                        lightColor={selectedCuisine === cuisine ? '#fff' : Colors.light.text}
                        darkColor={selectedCuisine === cuisine ? '#fff' : Colors.dark.text}
                      >
                        {cuisine.replace('_', ' ')}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Nutrient Filters */}
              <View style={styles.filterSection}>
                <ThemedText type="subtitle" style={styles.label}>
                  Nutrition Filters
                </ThemedText>
                
                {NUTRIENT_FILTERS.map((nutrient) => (
                  <View key={nutrient.minKey} style={styles.nutrientRow}>
                    <ThemedText style={styles.nutrientLabel}>
                      {nutrient.label}{nutrient.unit ? ` (${nutrient.unit})` : ''}:
                    </ThemedText>
                    <TextInput
                      style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                      placeholder="Min"
                      placeholderTextColor={icon + '80'}
                      value={nutrientFilter[nutrient.minKey]?.toString() || ''}
                      onChangeText={(val) => updateNutrientFilter(nutrient.minKey, val)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                      placeholder="Max"
                      placeholderTextColor={icon + '80'}
                      value={nutrientFilter[nutrient.maxKey]?.toString() || ''}
                      onChangeText={(val) => updateNutrientFilter(nutrient.maxKey, val)}
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                style={[styles.modalButton, styles.clearButton, { borderColor: icon + '90' }]}
              >
                <ThemedText>Clear</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSearch}
                style={[styles.modalButton, styles.searchButton]}
              >
                <ThemedText style={{ fontWeight: '600', color: '#fff' }}>
                  Search
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchBarButton: {
    padding: 4,
  },
  clearButton: {
    padding: 4,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBody: {
    maxHeight: 400,

  },
  filterSection: {
    marginTop: 24,
  },
  label: {
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  cuisineChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: Palette.gradientEnd,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  nutrientLabel: {
    width: 100,
    fontSize: 14,
  },
  nutrientInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
});

