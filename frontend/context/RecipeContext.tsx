import React, { createContext, useContext, useEffect, useState } from 'react';
import recipeService from '../services/recipeService';
import { Recipe } from '../types/pantry';

type ContextShape = {
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  addRecipe: (recipe: Recipe) => void; // Add recipe to favorites
  removeRecipe: (recipe: Recipe) => void; // Remove recipe from favorites
  getRecipeById: (id: number) => Promise<Recipe>; // Added getRecipeById to the context shape
  getRandomRecipe: () => Promise<Recipe>; // Get a random recipe
};

const RecipeContext = createContext<ContextShape | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favoriteIDs, setFavoriteIDs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const list = await recipeService.searchRecipes();
      setRecipes(list);
      for (const ID of favoriteIDs) {
        const recipe = await getRecipeById(ID);
        setFavoriteRecipes((prevRecipes) => [...prevRecipes, recipe]);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addRecipe = (recipe: Recipe) => {
    setFavoriteRecipes((prevRecipes) => [...prevRecipes, recipe]);
    setFavoriteIDs((prevIDs) => [...prevIDs, recipe.id]);
  };

  const removeRecipe = (recipe: Recipe) => {
    setFavoriteRecipes((prevRecipes) => prevRecipes.filter(r => r.id !== recipe.id));
    setFavoriteIDs((prevIDs) => prevIDs.filter(id => id !== recipe.id));
  };

  const getRecipeById = async (id: number): Promise<Recipe> => {
    return await recipeService.getRecipeById(id);
  };

  const getRandomRecipe = async (): Promise<Recipe> => {
    return await recipeService.getRandomRecipe();
  };

  return (
    <RecipeContext.Provider value={{ recipes, favoriteRecipes, loading, error, refresh: load, addRecipe, removeRecipe, getRecipeById, getRandomRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
}

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}