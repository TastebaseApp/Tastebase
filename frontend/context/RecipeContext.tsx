import React, { createContext, useContext, useEffect, useState } from 'react';
import recipeService from '../services/recipeService';
import { Recipe } from '../types/pantry';
import * as storage from '@/utils/storage';
import { useAuth } from './AuthContext';

type ContextShape = {
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  addRecipe: (recipe: Recipe) => Promise<void>; // Add recipe to favorites
  removeRecipe: (recipe: Recipe) => Promise<void>; // Remove recipe from favorites
  getRecipeById: (id: number) => Promise<Recipe>; // Added getRecipeById to the context shape
  getRandomRecipe: () => Promise<Recipe>; // Get a random recipe
  getRandomRecipes: (number: number) => Promise<Recipe[]>; // Get multiple random recipes
};

const RecipeContext = createContext<ContextShape | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { token } = useAuth();

  // Load favorite recipes when token changes
  useEffect(() => {
    const loadFavoriteRecipes = async () => {
      if (token) {
        try {
          const recipes = await recipeService.getFavoriteRecipes(token);
          if (recipes !== favoriteRecipes) {
            setFavoriteRecipes(recipes);
            // Save favorite recipes to storage
            try {
              await storage.setItem('favoriteRecipeIDs', JSON.stringify(recipes.map(r => r.id)));
            } catch (error) {
              console.error('Error saving favorite IDs to storage:', error);
            }
          }
        } catch (error) {
          console.warn('Error loading favorite recipes from database:', error);
          // Load favorite IDs from storage
          let favoriteIDs: number[] = [];
          try {
            const storedIDs = await storage.getItem('favoriteRecipeIDs');
            if (storedIDs) {
              favoriteIDs = JSON.parse(storedIDs);
            }
          } catch (error) {
            console.error('Error loading favorite IDs from storage:', error);
          }
          if (favoriteIDs && favoriteIDs.length > 0) {
            // Load favorite recipes using IDs
            const favoriteRecipesList: Recipe[] = [];
            for (const ID of favoriteIDs) {
              try {
                const recipe = await recipeService.getRecipeById(ID);
                favoriteRecipesList.push(recipe);
              } catch (error) {
                console.error('Error loading favorite recipe:', error);
              }
            }
            setFavoriteRecipes(favoriteRecipesList);
          }
        }
      }
      else {
        setFavoriteRecipes([]);
      }
    };
    loadFavoriteRecipes();
  }, [token]);

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

  const addRecipe = async (recipe: Recipe) => {
    if (favoriteRecipes.some(r => r.id === recipe.id)) {
      return;
    }
    if (!token) {
      console.warn('You must be logged in to add a recipe to your favorites');
      return;
    }
    
    const newIDs = favoriteRecipes
      .map(r => r.id)
      .concat(recipe.id);

    setFavoriteRecipes((prevRecipes) => [...prevRecipes, recipe]);

    // Save to database
    try {
      await recipeService.addFavoriteRecipe(recipe.id, token);
    } catch (error) {
      console.error('Error adding favorite recipe to database:', error);
    }
    
    // Save to storage (web: localStorage, mobile: AsyncStorage)
    try {
      await storage.setItem('favoriteRecipeIDs', JSON.stringify(newIDs));
    } catch (error) {
      console.error('Error saving favorite IDs to storage:', error);
    }
  };

  const removeRecipe = async (recipe: Recipe) => {
    if (!favoriteRecipes.some(r => r.id === recipe.id)) {
      return;
    }
    if (!token) {
      console.warn('You must be logged in to remove a recipe from your favorites');
      return;
    }

    const newIDs = favoriteRecipes
      .filter(r => r.id !== recipe.id)
      .map(r => r.id);
    
    setFavoriteRecipes((prevRecipes) => prevRecipes.filter(r => r.id !== recipe.id));

    // Save to database
    try {
      await recipeService.removeFavoriteRecipe(recipe.id, token);
    } catch (error) {
      console.error('Error removing favorite recipe from database:', error);
    }
    
    // Save to storage (web: localStorage, mobile: AsyncStorage)
    try {
      await storage.setItem('favoriteRecipeIDs', JSON.stringify(newIDs));
    } catch (error) {
      console.error('Error saving favorite IDs to storage:', error);
    }
  };

  const getRecipeById = async (id: number): Promise<Recipe> => {
    return await recipeService.getRecipeById(id);
  };

  const getRandomRecipe = async (): Promise<Recipe> => {
    const recipes = await recipeService.getRandomRecipe();
    return recipes[0];
  };

  const getRandomRecipes = async (number: number): Promise<Recipe[]> => {
    const recipes = await recipeService.getRandomRecipe(number);
    return recipes;
  };

  return (
    <RecipeContext.Provider value={{ recipes, favoriteRecipes, loading, error, refresh: load, addRecipe, removeRecipe, getRecipeById, getRandomRecipe, getRandomRecipes }}>
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