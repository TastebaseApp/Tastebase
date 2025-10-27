import React, { useState, useEffect } from 'react';
import { Pressable, StyleProp, useColorScheme, ViewStyle } from 'react-native';
import { useRecipes } from '../../context/RecipeContext';
import { Recipe } from '../../types/pantry';
import { IconSymbol } from './icon-symbol';
import { Colors } from '@/constants/theme';

interface FavoriteRecipeButtonProps {
  recipe: Recipe;
  style?: StyleProp<ViewStyle>;
}

const FavoriteRecipeButton: React.FC<FavoriteRecipeButtonProps> = ({ recipe, style }) => {
  const colorScheme = useColorScheme() || 'light';
  const { favoriteRecipes, addRecipe, removeRecipe } = useRecipes();
  const [isFavorite, setIsFavorite] = useState(favoriteRecipes.some(r => r.id === recipe.id));

  // Sync local state with context changes
  useEffect(() => {
    setIsFavorite(favoriteRecipes.some(r => r.id === recipe.id));
  }, [favoriteRecipes, recipe.id]);

  const handleToggleRecipe = () => {
    if (isFavorite) {
      removeRecipe(recipe);
    } else {
      addRecipe(recipe);
    }

    setIsFavorite(!isFavorite);
  };

  return (<Pressable onPress={handleToggleRecipe} style={style}>
    <IconSymbol size={24} name={isFavorite ? "star" : "star.fill"} color={Colors[colorScheme].tabIconSelected} />
  </Pressable>
  );
}

export default FavoriteRecipeButton;