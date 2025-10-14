import React from 'react';
import { Button } from 'react-native';
import { useRecipes } from '../../context/RecipeContext';
import { Recipe } from '../../types/pantry';

// This component defines a button that adds a random recipe from a predefined cache.
const AddRecipeButton: React.FC = () => {
  const { addRecipe } = useRecipes();

  // Function to handle adding a random recipe.
  const handleAddRecipe = () => {
    // Predefined cache of recipes in JSON format.
    const recipesCache = `
    [
      {
        "id": 1,
        "title": "Pancakes",
        "summary": "A delicious breakfast recipe.",
        "ingredients": [],
        "instructions": "Mix and cook.",
        "servings": 4,
        "readyInMinutes": 10
      },
      {
        "id": 2,
        "title": "Spaghetti",
        "summary": "A classic pasta dish.",
        "ingredients": [],
        "instructions": "Boil and mix.",
        "servings": 4,
        "readyInMinutes": 15
      },
      {
        "id": 3,
        "title": "Salad",
        "summary": "A healthy green salad.",
        "ingredients": [],
        "instructions": "Chop and mix.",
        "servings": 2,
        "readyInMinutes": 5
      }
    ]`;

    try {
      // Parse the cache into an array of recipes.
      const recipes: Recipe[] = JSON.parse(recipesCache);
      // Select a random recipe from the array.
      const randomIndex = Math.floor(Math.random() * recipes.length);
      const randomRecipe = recipes[randomIndex];
      // Add the selected recipe using the context method.
      addRecipe(randomRecipe);
    } catch (error) {
      console.error('Failed to parse recipes cache:', error);
    }
  };

  // Render a button that triggers the add recipe functionality.
  return <Button title="Add Random Recipe" onPress={handleAddRecipe} />;
};

export default AddRecipeButton;