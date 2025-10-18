import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
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
  const screenWidth = Dimensions.get('window').width;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imageHeight, setImageHeight] = useState<number | null>(null);

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

  useEffect(() => {
    if (recipe?.image && screenWidth) {
      Image.getSize(recipe.image, (width, height) => {
        const aspectRatio = width / height;
        setImageHeight(screenWidth / aspectRatio);
      });
    }
  }, [recipe?.image, screenWidth]);

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
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerBackTitle: '',
        }} 
      />
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.container}>
          {/* Recipe Image */}
          {recipe.image && (
            <Image
              source={{ uri: recipe.image }}
              style={[styles.recipeImage, { width: screenWidth, height: imageHeight }]}
              resizeMode="cover"
            />
          )}
          
          {/* Recipe Title */}
          <ThemedText type="title" style={styles.title}>
            {recipe.title}
          </ThemedText>
          
          {/* Cooking Time */}
          {recipe.readyInMinutes && (
            <ThemedText type="subtitle" style={styles.cookingTime}>
              Ready in {recipe.readyInMinutes} minutes
            </ThemedText>
          )}
          
          {/* Recipe Description/Summary */}
          {recipe.summary && (
            <ThemedText type="default" style={styles.description}>
              {recipe.summary}
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  recipeImage: {
    backgroundColor: '#f0f0f0', // Fallback color if image fails to load
  },
  title: {
    textAlign: 'left',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cookingTime: {
    textAlign: 'left',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  description: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
});
