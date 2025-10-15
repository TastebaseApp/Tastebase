import { Recipe } from '../types/pantry';

// Backend JSON types for recipes
export interface BackendRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings?: number;
  readyInMinutes?: number;
  summary?: string;
  dishTypes?: string[];
  extendedIngredients?: any[]; // Will be parsed separately if needed
  analyzedInstructions?: any[]; // Will be parsed separately if needed
  winePairing?: {
    pairedWines?: string[];
    pairingText?: string;
  } | null;
}

export interface BackendRecipesResponse {
  offset: number;
  number: number;
  results: BackendRecipe[];
  totalResults: number;
}

// Parser configuration
export interface RecipeParserConfig {
  includeOptionalFields?: boolean; // Whether to include optional fields like summary, dishTypes, etc.
}

/**
 * Parses backend recipes JSON and converts to frontend Recipe format
 * @param jsonData - The backend recipes JSON response
 * @param config - Optional configuration for parsing behavior
 * @returns Array of Recipe objects compatible with frontend types
 */
export function parseRecipes(
  jsonData: BackendRecipesResponse | string,
  config: RecipeParserConfig = {}
): Recipe[] {
  const {
    includeOptionalFields = true
  } = config;

  // Parse JSON string if needed
  const data: BackendRecipesResponse = typeof jsonData === 'string' 
    ? JSON.parse(jsonData) 
    : jsonData;

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error('Invalid recipes data: expected array of results');
  }

  return data.results.map((recipe, index) => {
    // Validate recipe structure
    if (!recipe.id || !recipe.title) {
      throw new Error(`Invalid recipe at index ${index}: missing id or title`);
    }

    // Create recipe object with required fields
    const parsedRecipe: Recipe = {
      id: recipe.id,
      title: recipe.title.trim(),
      image: recipe.image || undefined
    };

    // Add optional fields if configured to include them
    if (includeOptionalFields) {
      if (recipe.servings !== undefined) {
        parsedRecipe.servings = recipe.servings;
      }
      
      if (recipe.readyInMinutes !== undefined) {
        parsedRecipe.readyInMinutes = recipe.readyInMinutes;
      }
      
      if (recipe.summary) {
        parsedRecipe.summary = recipe.summary.trim();
      }
      
      if (recipe.dishTypes && Array.isArray(recipe.dishTypes)) {
        parsedRecipe.dishTypes = recipe.dishTypes;
      }
      
      if (recipe.winePairing) {
        parsedRecipe.winePairing = recipe.winePairing;
      }
    }

    return parsedRecipe;
  });
}

/**
 * Parses a single recipe from backend format
 * @param recipe - Single backend recipe object
 * @param includeOptionalFields - Whether to include optional fields
 * @returns Recipe object compatible with frontend types
 */
export function parseSingleRecipe(
  recipe: BackendRecipe,
  includeOptionalFields: boolean = true
): Recipe {
  if (!recipe.id || !recipe.title) {
    throw new Error('Invalid recipe: missing id or title');
  }

  // Create recipe object with required fields
  const parsedRecipe: Recipe = {
    id: recipe.id,
    title: recipe.title.trim(),
    image: recipe.image || undefined
  };

  // Add optional fields if configured to include them
  if (includeOptionalFields) {
    if (recipe.servings !== undefined) {
      parsedRecipe.servings = recipe.servings;
    }
    
    if (recipe.readyInMinutes !== undefined) {
      parsedRecipe.readyInMinutes = recipe.readyInMinutes;
    }
    
    if (recipe.summary) {
      parsedRecipe.summary = recipe.summary.trim();
    }
    
    if (recipe.dishTypes && Array.isArray(recipe.dishTypes)) {
      parsedRecipe.dishTypes = recipe.dishTypes;
    }
    
    if (recipe.winePairing) {
      parsedRecipe.winePairing = recipe.winePairing;
    }
  }

  return parsedRecipe;
}

/**
 * Validates that a JSON string or object matches the expected backend format
 * @param data - JSON string or object to validate
 * @returns true if valid, throws error if invalid
 */
export function validateRecipesFormat(data: any): boolean {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Data must be an object');
    }

    if (!parsed.results || !Array.isArray(parsed.results)) {
      throw new Error('Data must contain a "results" array');
    }

    // Validate pagination fields
    if (typeof parsed.offset !== 'number') {
      throw new Error('Data must have a numeric "offset" field');
    }

    if (typeof parsed.number !== 'number') {
      throw new Error('Data must have a numeric "number" field');
    }

    if (typeof parsed.totalResults !== 'number') {
      throw new Error('Data must have a numeric "totalResults" field');
    }

    // Validate each recipe
    parsed.results.forEach((recipe: any, index: number) => {
      if (!recipe.id || typeof recipe.id !== 'number') {
        throw new Error(`Recipe at index ${index} must have a valid numeric "id"`);
      }

      if (!recipe.title || typeof recipe.title !== 'string') {
        throw new Error(`Recipe at index ${index} must have a valid "title" string`);
      }

      if (recipe.image !== undefined && typeof recipe.image !== 'string') {
        throw new Error(`Recipe at index ${index} image must be a string if provided`);
      }

      if (recipe.imageType !== undefined && typeof recipe.imageType !== 'string') {
        throw new Error(`Recipe at index ${index} imageType must be a string if provided`);
      }

      // Validate optional fields if present
      if (recipe.servings !== undefined && typeof recipe.servings !== 'number') {
        throw new Error(`Recipe at index ${index} servings must be a number if provided`);
      }

      if (recipe.readyInMinutes !== undefined && typeof recipe.readyInMinutes !== 'number') {
        throw new Error(`Recipe at index ${index} readyInMinutes must be a number if provided`);
      }

      if (recipe.summary !== undefined && typeof recipe.summary !== 'string') {
        throw new Error(`Recipe at index ${index} summary must be a string if provided`);
      }

      if (recipe.dishTypes !== undefined && !Array.isArray(recipe.dishTypes)) {
        throw new Error(`Recipe at index ${index} dishTypes must be an array if provided`);
      }
    });

    return true;
  } catch (error) {
    throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extracts pagination information from the backend response
 * @param jsonData - The backend recipes JSON response
 * @returns Object containing pagination information
 */
export function extractPaginationInfo(
  jsonData: BackendRecipesResponse | string
): { offset: number; number: number; totalResults: number } {
  const data: BackendRecipesResponse = typeof jsonData === 'string' 
    ? JSON.parse(jsonData) 
    : jsonData;

  return {
    offset: data.offset,
    number: data.number,
    totalResults: data.totalResults
  };
}

// Default export for convenience
export default {
  parseRecipes,
  parseSingleRecipe,
  validateRecipesFormat,
  extractPaginationInfo
};
