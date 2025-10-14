import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import Recipe from "./recipe";
import { Colors } from "../constants/theme";
import { StyleSheet, useColorScheme } from "react-native";
import { useRecipes } from "@/context/RecipeContext";

export default function RecipeList() {
  const { recipes, loading, error } = useRecipes(); // Get recipes from RecipeContext
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
      {(recipes.length > 0) ? 
        recipes.map((recipe, index) => (
          <Recipe 
            key={index} 
            recipe={recipe} 
            onPress={() => {console.log('Recipe', recipe.id, ' pressed: ', recipe.title)}} 
          />
        ))
      : 
      ( // Show message if recipe array is empty
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="subtitle" style={styles.emptyMessage}>
            No recipes found.
          </ThemedText>
          <ThemedText type="subtitle" style={styles.emptyMessage}>
            Try adjusting your search or filters.
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