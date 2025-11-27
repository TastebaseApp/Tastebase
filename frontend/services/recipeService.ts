import { Recipe } from '../types/pantry';
import { parseRecipes, validateRecipesFormat } from '../utils/recipeParser';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// Nutrient filter options matching NutrientFilter.java properties
export type NutrientFilterOptions = {
  minCalories?: number;
  maxCalories?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minProtein?: number;
  maxProtein?: number;
  minFat?: number;
  maxFat?: number;
  minFiber?: number;
  maxFiber?: number;
  minSugar?: number;
  maxSugar?: number;
  minSodium?: number;
  maxSodium?: number;
  minSaturatedFat?: number;
  maxSaturatedFat?: number;
  minCholesterol?: number;
  maxCholesterol?: number;
};

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
    nutrientFilter?: NutrientFilterOptions;
  } = {}): Promise<Recipe[]> {
    if (!API_BASE) {
      throw new Error('API_BASE is not set');
    }

    // Normalize empty strings to undefined for proper checking
    const query = options.query?.trim() || undefined;
    const ingredients = options.ingredients?.trim() || undefined;
    const cuisine = options.cuisine?.trim() || undefined;
    const number = options.number;
    
    // Check if nutrient filter has any values
    const hasNutrientFilter = options.nutrientFilter && 
      Object.values(options.nutrientFilter).some(val => val !== undefined);
    
    // If no search parameters provided, get random recipes
    if (!query && !ingredients && !cuisine && !hasNutrientFilter) {
      return await this.getRandomRecipe(10);
    }

    // Build URL with URLSearchParams to handle optional parameters
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (ingredients) params.append('ingredients', ingredients);
    if (cuisine) params.append('cuisine', cuisine);
    if (number && number > 0) params.append('number', number.toString());

    // Add nutrient filter as single JSON-encoded query parameter
    if (options.nutrientFilter && hasNutrientFilter) {
      params.append('nutrientFilter', JSON.stringify(options.nutrientFilter));
    }

    // Double-check: if params is empty after filtering, get random recipes
    if (params.toString() === '') {
      return await this.getRandomRecipe(10);
    }

    // Step 1: Get recipe snippets (with IDs) from the search endpoint
    const url = `${API_BASE}/api/recipes/search?${params.toString()}`;
    
    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!resp.ok) {
      throw new Error(`Failed to search recipes (${resp.status})`);
    }

    // Step 2: Parse the snippets array - each snippet contains an ID
    const searchData = await getJson<any[]>(resp);
    const snippets = Array.isArray(searchData) ? searchData : [searchData];
    
    if (!snippets || snippets.length === 0) {
      return [];
    }

    // Step 3: Extract recipe IDs from each snippet
    const recipeIds: number[] = snippets
      .map((snippet: any) => snippet.id)
      .filter((id: any): id is number => typeof id === 'number' && !isNaN(id));

    if (recipeIds.length === 0) {
      return [];
    }

    // Step 4: Retrieve full recipe details for each ID via getRecipeById
    // getRecipeById() already returns full details with instructions, ingredients, etc.
    const fullRecipes: Recipe[] = [];
    for (const id of recipeIds) {
      try {
        const recipe = await this.getRecipeById(id);
        fullRecipes.push(recipe);
      } catch (error) {
        // Skip recipes that fail to fetch
        console.error(`Failed to fetch recipe ${id}:`, error);
      }
    }

    // Step 5: Return complete Recipe objects ready for display on recipe cards and popup
    return fullRecipes.map((r) => ({ 
      ...r, 
      ingredients: r.ingredients?.map(i => ({ ...i, amount: { ...i.amount } })) 
    }));
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