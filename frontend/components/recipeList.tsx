import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import Recipe from "./recipe";
import { Colors } from "../constants/theme";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRecipes } from "@/context/RecipeContext";

interface RecipeListProps {
  showFavorites?: boolean;
}

export default function RecipeList({ showFavorites = false }: RecipeListProps) {
  const { recipes, favoriteRecipes, loading, error } = useRecipes(); // Get recipes from RecipeContext
  const displayRecipes = showFavorites ? favoriteRecipes : recipes;
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <ThemedView
        style={[styles.container, { borderColor: Colors[colorScheme].tint }]}
      >
        <ThemedText type="subtitle">Loading recipes...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView
        style={[styles.container, { paddingTop: 20 }]}
      >
        <ThemedText type="subtitle">Error loading recipes: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container]}
    >
      {displayRecipes.length > 0 ? (
        <ThemedView style={styles.grid}>
          {displayRecipes.map((recipe) => (
            <ThemedView key={recipe.id} style={styles.gridItem}>
              <Recipe recipe={recipe} />
            </ThemedView>
          ))}
        </ThemedView>
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="subtitle" style={styles.emptyMessage}>
            {showFavorites ? "No favorite recipes found." : "No recipes found."}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.emptyMessage}>
            {showFavorites
              ? "Add some recipes to your favorites to see them here."
              : "Try adjusting your search or filters."}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 0,
    minHeight: 50,
    minWidth: 100,
    maxWidth: "100%",
    alignSelf: "center",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  emptyMessage: {
    textAlign: "center",
    margin: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  gridItem: {
    width: "100%",
    marginBottom: 16,
  },
});
