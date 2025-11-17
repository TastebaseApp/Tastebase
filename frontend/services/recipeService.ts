import { Recipe } from '../types/pantry';
import { parseRecipes, validateRecipesFormat } from '../utils/recipeParser';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// Local storage for recipe IDs (not full recipes)
let savedRecipeIds: number[] = [];

async function getJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error('Failed to parse JSON response');
  }
}

export const recipeService = {
  // Function to search recipes by ingredients (default: no ingredients = get 10 random recipes)
  async searchRecipes(ingredients: string = ''): Promise<Recipe[]> {
    if (!API_BASE) {
      throw new Error('API_BASE is not set');
    }

    if (ingredients) {
      // Search with specific ingredients
      const url = `${API_BASE}/api/recipes/search?ingredients=${encodeURIComponent(ingredients)}`;
      
      const resp = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!resp.ok) {
        throw new Error(`Failed to search recipes (${resp.status})`);
      }

      const data = await getJson<any[]>(resp);
      const arrayData = Array.isArray(data) ? data : [data];
      validateRecipesFormat(arrayData);
      const recipes = parseRecipes(arrayData);
      
      return recipes.map((r) => ({ ...r, ingredients: r.ingredients?.map(i => ({ ...i, amount: { ...i.amount } })) }));
    } else {
      // No ingredients provided - get 10 random recipes
      const recipes: Recipe[] = await this.getRandomRecipe(10);
      
      return recipes;
    }
  },

  // Function to get a random recipe
  async getRandomRecipe(number: number = 10): Promise<Recipe[]> {
    const resp = await fetch(`${API_BASE}/api/recipes/random?number=${number}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!resp.ok) {
      throw new Error(`Failed to get random recipe (${resp.status})`);
    }

    const data = await getJson<any>(resp);
    const recipes = parseRecipes(data);
    return recipes;
  },

  // Function to get a recipe by ID
  async getRecipeById(id: number): Promise<Recipe> {
    const resp = await fetch(`${API_BASE}/api/recipes/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!resp.ok) {
      throw new Error(`Failed to get recipe (${resp.status})`);
    }

    const data = await getJson<any>(resp);
    const recipes = parseRecipes([data]);
    return recipes[0];
  },

  // Function to add a recipe ID to local storage (not the full recipe)
  async addRecipe(newRecipe: Recipe): Promise<void> {
    if (!savedRecipeIds.includes(newRecipe.id)) {
      savedRecipeIds.push(newRecipe.id);
    }
    console.log('Recipe ID added to local list:', newRecipe.id);
  },

  // Function to get saved recipe IDs
  getSavedRecipeIds(): number[] {
    return [...savedRecipeIds];
  },
};

export default recipeService;