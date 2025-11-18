import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { Colors } from "../constants/theme";
import { Pantry, Recipe as RecipeType } from "../types/pantry";
import { Pressable, StyleSheet, useColorScheme, Image } from "react-native";
import { router } from "expo-router";
import FavoriteRecipeButton from "./ui/favoriteRecipeButton";
import { useEffect, useState } from "react";
import { compareRecipeToPantry } from "@/utils/recipeIngredientComparer";
import { usePantry } from "@/context/PantryContext";

type RecipeProps = {
  recipe: RecipeType;
  onPress?: () => void;
};



export default function Recipe({ recipe, onPress }: RecipeProps) {

  const [aspectRatio, setAspectRatio] = useState(1);
  const colorScheme = useColorScheme() || "light";

  useEffect(() => {
    if (!recipe.image) return;

    Image.getSize(
      recipe.image,
      (w, h) => setAspectRatio(w / h),
      () => console.warn("Failed to load image size")
    );
  }, [recipe.image]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default behavior: navigate to recipe detail
      router.push(`/recipe/${recipe.id}` as any);
    }
  };

  const userPantry : Pantry = {pantryID: 0, pantryName: "", pantryItems: usePantry().ingredients};

  const ingredientsNeeded = compareRecipeToPantry(
    recipe,
    userPantry);

  return (
    <Pressable
      style={[styles.card]}
      onPress={handlePress}
    >
      <ThemedView style={styles.imageWrapper}>
        <Image
          source={{ uri: recipe.image }}
          style={[styles.image, { aspectRatio }]}
          resizeMode="contain"
        />
      </ThemedView>

      <ThemedView style={styles.titleRow}>
        <FavoriteRecipeButton recipe={recipe} />
        <ThemedText type="subtitle" style={styles.title}>
          {recipe.title}
        </ThemedText>
      </ThemedView>
      <ThemedText type="default" style={styles.infoRow} numberOfLines={2}>
        {recipe.summary}
      </ThemedText>
      <ThemedView style={styles.infoRow}>
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 14,
            marginTop: 6,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/icons/TimeEstimateClock.png")}
            style={styles.clockIcon}
          ></Image>
          <ThemedText type="default" style={styles.infoText}>
            {recipe.readyInMinutes} min
          </ThemedText>
        </ThemedView>

        <ThemedText type="default" style={styles.infoText}>
          {ingredientsNeeded[0]}/{ingredientsNeeded[1]} ingredients
        </ThemedText>

        <ThemedText type="default" style={styles.infoText}>
          Serves: {recipe.servings}
        </ThemedText>

      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 12,
    alignSelf: "center",

    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  imageWrapper: {
    width: "100%",
    position: "relative",
  },

  image: {
    width: "100%",
    height: undefined,
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    flexShrink: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 14,
    marginTop: 6,
    alignItems: "center",
    overflow: "hidden",
    maxHeight: 48,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  clockIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },

  infoText: {
    fontSize: 14,
    opacity: 0.75,
  },
});
