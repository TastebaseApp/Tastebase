import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRecipes } from '@/context/RecipeContext';
import { Recipe } from '@/types/pantry';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() || 'light';
  const { getRecipeById } = useRecipes();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) {
        setError('No recipe ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const recipeId = parseInt(id, 10);
        const recipeData = await getRecipeById(recipeId);
        setRecipe(recipeData);
      } catch (err: any) {
        setError(err?.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, getRecipeById]);

  if (loading) {
    return (
      <ThemedView style={[styles.container, { borderColor: Colors[colorScheme].tint }]}>
        <ThemedText type="subtitle">Loading recipe...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, { borderColor: Colors[colorScheme].tint }]}>
        <ThemedText type="subtitle">Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  if (!recipe) {
    return (
      <ThemedView style={[styles.container, { borderColor: Colors[colorScheme].tint }]}>
        <ThemedText type="subtitle">Recipe not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={[styles.container, { borderColor: Colors[colorScheme].tint }]}>
        <ThemedText type="title" style={styles.title}>
          {recipe.title}
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    margin: 20,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
});
