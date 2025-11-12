import React, { createContext, useContext, useEffect, useState } from 'react';
import recipeService from '../services/recipeService';
import { Recipe } from '../types/pantry';
import { useAuth } from './AuthContext';

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
  const { token } = useAuth();

  // Load favorite IDs from localStorage on initialization
  useEffect(() => {
    const loadFavoriteIDs = () => {
      if (!token) {
        setFavoriteIDs([]);
        setFavoriteRecipes([]);
        return;
      }
      try {
        const storedIDs = localStorage.getItem('favoriteRecipeIDs');
        if (storedIDs) {
          const parsedIDs = JSON.parse(storedIDs);
          setFavoriteIDs(parsedIDs);
        }
      } catch (error) {
        console.error('Error loading favorite IDs from localStorage:', error);
      }
    };
    
    loadFavoriteIDs();
  }, [token]);

  // Load favorite recipes when favoriteIDs change
  useEffect(() => {
    const loadFavoriteRecipes = async () => {
      if (favoriteIDs.length > 0) {
        try {
          const favoriteRecipesList: Recipe[] = [];
          for (const ID of favoriteIDs) {
            const recipe = await getRecipeById(ID);
            favoriteRecipesList.push(recipe);
          }
          setFavoriteRecipes(favoriteRecipesList);
        } catch (error) {
          console.error('Error loading favorite recipes:', error);
        }
      } else {
        setFavoriteRecipes([]);
      }
    };

    loadFavoriteRecipes();
  }, [favoriteIDs]);

  const load = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const list = await recipeService.searchRecipes();
      setRecipes(list);
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
    const newIDs = [...favoriteIDs, recipe.id];
    setFavoriteIDs(newIDs);
    
    // Save to localStorage
    try {
      localStorage.setItem('favoriteRecipeIDs', JSON.stringify(newIDs));
    } catch (error) {
      console.error('Error saving favorite IDs to localStorage:', error);
    }
  };

  const removeRecipe = (recipe: Recipe) => {
    setFavoriteRecipes((prevRecipes) => prevRecipes.filter(r => r.id !== recipe.id));
    const newIDs = favoriteIDs.filter(id => id !== recipe.id);
    setFavoriteIDs(newIDs);
    
    // Save to localStorage
    try {
      localStorage.setItem('favoriteRecipeIDs', JSON.stringify(newIDs));
    } catch (error) {
      console.error('Error saving favorite IDs to localStorage:', error);
    }
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