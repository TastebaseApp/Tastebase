import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRecipes } from '../../context/RecipeContext';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

// This component defines a button that adds a random recipe from a predefined cache.
const AddRecipeButton: React.FC = () => {
  const { addRecipe, getRandomRecipe } = useRecipes();

  // Function to handle adding a random recipe.
  const handleAddRecipe = async (): Promise<void> => {
    const randomRecipe = await getRandomRecipe();
    await addRecipe(randomRecipe);
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Palette.gradientEnd }]}
      onPress={handleAddRecipe}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.buttonText} lightColor={Palette.white} darkColor={Palette.white}>
        Add Random Recipe
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default AddRecipeButton;