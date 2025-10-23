import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import Recipe from "./recipe";
import { Colors } from "../constants/theme";
import { StyleSheet, useColorScheme } from "react-native";
import { useRecipes } from "@/context/RecipeContext";

interface RecipeListProps {
  showFavorites?: boolean;
}

export default function RecipeList({ showFavorites = false }: RecipeListProps) {
  const { recipes, favoriteRecipes, loading, error } = useRecipes(); // Get recipes from RecipeContext
  const displayRecipes = showFavorites ? favoriteRecipes : recipes;
  const colorScheme = useColorScheme() || 'light';

  if (loading) {
    return (
      <ThemedView style={[styles.container, { borderColor: Colors[colorScheme].tint }]}>
        <ThemedText type="subtitle">
          Loading recipes...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, { borderColor: Colors[colorScheme].tint }]}>
        <ThemedText type="subtitle">
          Error loading recipes: {error}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { borderColor: Colors[colorScheme].tint }]}>
      {(displayRecipes.length > 0) ? 
        displayRecipes.map((recipe, index) => (
          <Recipe 
            key={index} 
            recipe={recipe} 
          />
        ))
      : 
      ( // Show message if recipe array is empty
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="subtitle" style={styles.emptyMessage}>
            {showFavorites ? 'No favorite recipes found.' : 'No recipes found.'}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.emptyMessage}>
            {showFavorites ? 'Add some recipes to your favorites to see them here.' : 'Try adjusting your search or filters.'}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 5,
    minHeight: 50,
    minWidth: 100,
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 20,
  },
  emptyMessage: {
    textAlign: 'center', 
    margin: 10,
  }
});