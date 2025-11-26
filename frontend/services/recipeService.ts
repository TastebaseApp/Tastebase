import { Recipe } from '../types/pantry';
import { parseRecipes, validateRecipesFormat } from '../utils/recipeParser';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

async function getJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error('Failed to parse JSON response');
  }
}

export const recipeService = {
  // Enhanced search function with all parameters
  async searchRecipes(options: {
    query?: string;
    ingredients?: string;
    cuisine?: string;
    number?: number;
  } = {}): Promise<Recipe[]> {
    if (!API_BASE) {
      throw new Error('API_BASE is not set');
    }

    // Normalize empty strings to undefined for proper checking
    const query = options.query?.trim() || undefined;
    const ingredients = options.ingredients?.trim() || undefined;
    const cuisine = options.cuisine?.trim() || undefined;
    const number = options.number;
    
    // If no search parameters provided, get random recipes
    if (!query && !ingredients && !cuisine) {
      return await this.getRandomRecipe(10);
    }

    // Build URL with URLSearchParams to handle optional parameters
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (ingredients) params.append('ingredients', ingredients);
    if (cuisine) params.append('cuisine', cuisine);
    if (number && number > 0) params.append('number', number.toString());

    // Double-check: if params is empty after filtering, get random recipes
    if (params.toString() === '') {
      return await this.getRandomRecipe(10);
    }

    const url = `${API_BASE}/api/recipes/search?${params.toString()}`;
    
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

  async getFavoriteRecipes(token: string | null): Promise<Recipe[]> {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const resp = await fetch(`${API_BASE}/api/user/favorites`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    
    if (!resp.ok) {
      throw new Error(`Failed to get favorite recipes (${resp.status})`);
    }

    const data = await getJson<any>(resp);
    const recipes = parseRecipes(data);
    return recipes;
  },

  // Function to add a recipe ID to local storage (not the full recipe)
  async addFavoriteRecipe(recipeID: number, token: string | null): Promise<void> {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const resp = await fetch(`${API_BASE}/api/user/favorites/${recipeID}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });

    if (!resp.ok) {
      throw new Error(`Failed to add favorite recipe (${resp.status})`);
    }
  },

  async removeFavoriteRecipe(recipeID: number, token: string | null): Promise<void> {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const resp = await fetch(`${API_BASE}/api/user/favorites/${recipeID}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    
    if (!resp.ok) {
      throw new Error(`Failed to remove favorite recipe (${resp.status})`);
    }
  },
};

export default recipeService;