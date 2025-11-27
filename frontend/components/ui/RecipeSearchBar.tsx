import React, { useState } from 'react';
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
  const [number, setNumber] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [nutrientFilter, setNutrientFilter] = useState<NutrientFilterOptions>({});
  
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
      number,
      nutrientFilter: Object.keys(nutrientFilter).length > 0 ? nutrientFilter : undefined,
    };
    onSearch(searchOptions);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setIngredients('');
    setSelectedCuisine('');
    setNumber(10);
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
      number: 10,
      nutrientFilter: undefined,
    });
  };

  const hasActiveFilters = searchQuery || ingredients || selectedCuisine || Object.keys(nutrientFilter).length > 0;

  return (
    <View style={styles.container}>
      {/* Main Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: bg, borderColor: icon + '33' }]}>
        <AntDesign name="search" size={20} color={icon} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: text }]}
          placeholder="Search recipes..."
          placeholderTextColor={icon + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={styles.filterButton}
        >
          <AntDesign name="filter" size={20} color={icon} />
        </TouchableOpacity>
        {hasActiveFilters ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <AntDesign name="close-circle" size={18} color={icon} />
          </TouchableOpacity>
        ) : null}
      </View>

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
                        style={{
                          color: selectedCuisine === cuisine ? '#fff' : text,
                        }}
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
                
                {/* Calories */}
                <View style={styles.nutrientRow}>
                  <ThemedText style={styles.nutrientLabel}>Calories:</ThemedText>
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Min"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.minCalories?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('minCalories', val)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Max"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.maxCalories?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('maxCalories', val)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Carbs */}
                <View style={styles.nutrientRow}>
                  <ThemedText style={styles.nutrientLabel}>Carbs (g):</ThemedText>
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Min"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.minCarbs?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('minCarbs', val)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Max"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.maxCarbs?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('maxCarbs', val)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Protein */}
                <View style={styles.nutrientRow}>
                  <ThemedText style={styles.nutrientLabel}>Protein (g):</ThemedText>
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Min"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.minProtein?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('minProtein', val)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Max"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.maxProtein?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('maxProtein', val)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Fat */}
                <View style={styles.nutrientRow}>
                  <ThemedText style={styles.nutrientLabel}>Fat (g):</ThemedText>
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Min"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.minFat?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('minFat', val)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Max"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.maxFat?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('maxFat', val)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Fiber */}
                <View style={styles.nutrientRow}>
                  <ThemedText style={styles.nutrientLabel}>Fiber (g):</ThemedText>
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Min"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.minFiber?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('minFiber', val)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Max"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.maxFiber?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('maxFiber', val)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Sugar */}
                <View style={styles.nutrientRow}>
                  <ThemedText style={styles.nutrientLabel}>Sugar (g):</ThemedText>
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Min"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.minSugar?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('minSugar', val)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Max"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.maxSugar?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('maxSugar', val)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Sodium */}
                <View style={styles.nutrientRow}>
                  <ThemedText style={styles.nutrientLabel}>Sodium (mg):</ThemedText>
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Min"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.minSodium?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('minSodium', val)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.nutrientInput, { color: text, borderColor: icon + '33', backgroundColor: bg }]}
                    placeholder="Max"
                    placeholderTextColor={icon + '80'}
                    value={nutrientFilter.maxSodium?.toString() || ''}
                    onChangeText={(val) => updateNutrientFilter('maxSodium', val)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Number of Results */}
              <View style={styles.filterSection}>
                <ThemedText type="subtitle" style={styles.label}>
                  Number of Results: {number}
                </ThemedText>
                <View style={styles.numberControls}>
                  <TouchableOpacity
                    onPress={() => setNumber(Math.max(1, number - 1))}
                    style={[styles.numberButton, { borderColor: icon + '33' }]}
                  >
                    <AntDesign name="minus" size={16} color={icon} />
                  </TouchableOpacity>
                  <ThemedText style={styles.numberDisplay}>{number}</ThemedText>
                  <TouchableOpacity
                    onPress={() => setNumber(Math.min(50, number + 1))}
                    style={[styles.numberButton, { borderColor: icon + '33' }]}
                  >
                    <AntDesign name="plus" size={16} color={icon} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                style={[styles.modalButton, styles.clearButton, { borderColor: icon + '33' }]}
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
    marginVertical: 12,
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
  filterButton: {
    padding: 4,
  },
  clearButton: {
    padding: 4,
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
    marginBottom: 20,
  },
  modalBody: {
    maxHeight: 400,
  },
  filterSection: {
    marginBottom: 24,
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
  numberControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  numberButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberDisplay: {
    fontSize: 18,
    minWidth: 40,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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

