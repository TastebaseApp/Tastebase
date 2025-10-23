import React, { useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { useRecipes } from '../../context/RecipeContext';
import { Recipe } from '../../types/pantry';
import { IconSymbol } from './icon-symbol';

interface FavoriteRecipeButtonProps {
  recipe: Recipe;
  style?: StyleProp<ViewStyle>;
}

const FavoriteRecipeButton: React.FC<FavoriteRecipeButtonProps> = ({ recipe, style }) => {
  const { favoriteRecipes, addRecipe, removeRecipe } = useRecipes();
  const [isFavorite, setIsFavorite] = useState(favoriteRecipes.some(r => r.id === recipe.id));

  const handleToggleRecipe = () => {
    if (isFavorite) {
      removeRecipe(recipe);
    } else {
      addRecipe(recipe);
    }

    setIsFavorite(!isFavorite);
  };

  return (<Pressable onPress={handleToggleRecipe} style={style}>
    <IconSymbol size={24} name={isFavorite ? "star" : "star.fill"} color="white" />
  </Pressable>
  );
}

export default FavoriteRecipeButton;