import { Recipe, Ingredient, Quantity } from '../types/pantry';

/**
 * Removes HTML tags and links from text content
 * @param html - HTML string to clean
 * @returns Clean text without HTML tags
 */
function cleanHtml(html: string): string {
  return html
    // Remove HTML tags (including links)
    .replace(/<[^>]*>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses extendedIngredients array into Ingredient[] format
 * @param extendedIngredients - Array of extended ingredient objects from API
 * @returns Array of Ingredient objects
 */
function parseExtendedIngredients(extendedIngredients: any[]): Ingredient[] {
  if (!Array.isArray(extendedIngredients)) {
    return [];
  }

  return extendedIngredients.map((ing) => {
    const quantity: Quantity = {
      amount: ing.amount || 0,
      unit: ing.unit || ''
    };

    const ingredient: Ingredient = {
      itemID: ing.id || 0,
      itemName: ing.nameClean || ing.name || ing.originalName || '',
      amount: quantity,
      image: ing.image
    };

    return ingredient;
  });
}

/**
 * Parses analyzedInstructions or instructions into plain text
 * @param analyzedInstructions - Array of analyzed instruction objects
 * @param instructions - HTML string of instructions
 * @returns Plain text instructions string
 */
function parseInstructions(
  analyzedInstructions?: any[],
  instructions?: string
): string | undefined {
  // Prefer analyzedInstructions if available (more structured)
  if (analyzedInstructions && Array.isArray(analyzedInstructions) && analyzedInstructions.length > 0) {
    const allSteps: string[] = [];
    
    analyzedInstructions.forEach((instructionGroup) => {
      if (instructionGroup.steps && Array.isArray(instructionGroup.steps)) {
        instructionGroup.steps.forEach((step: any) => {
          if (step.step) {
            // Clean HTML from step
            const cleanStep = cleanHtml(step.step);
            if (cleanStep) {
              allSteps.push(cleanStep);
            }
          }
        });
      }
    });
    
    if (allSteps.length > 0) {
      return allSteps.join('\n\n');
    }
  }
  
  // Fall back to instructions HTML string
  // Handle <ol><li> structure by converting <li> to newlines
  if (instructions) {
    // First, convert <li> tags to newlines before cleaning
    let processed = instructions
      .replace(/<li[^>]*>/gi, '\n') // Replace <li> with newline
      .replace(/<\/li>/gi, '')      // Remove </li>
      .replace(/<ol[^>]*>/gi, '')   // Remove <ol>
      .replace(/<\/ol>/gi, '')      // Remove </ol>
      // Remove other HTML tags but preserve newlines
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    // Clean up: split by newlines, trim each line, filter empty, rejoin
    processed = processed
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    return processed || undefined;
  }
  
  return undefined;
}

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
  cuisines?: string[];
  diets?: string[];
  instructions?: string; // HTML string
  extendedIngredients?: Array<{
    id: number;
    name: string;
    nameClean?: string;
    original: string;
    originalName?: string;
    amount: number;
    unit: string;
    image?: string;
  }>;
  analyzedInstructions?: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
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
 * Parses backend recipes JSON array and converts to frontend Recipe format
 * @param jsonData - The backend recipes JSON array response
 * @param config - Optional configuration for parsing behavior
 * @returns Array of Recipe objects compatible with frontend types
 */
export function parseRecipes(
  jsonData: BackendRecipe[] | string,
  config: RecipeParserConfig = {}
): Recipe[] {
  const {
    includeOptionalFields = true
  } = config;

  // Parse JSON string if needed
  const data: BackendRecipe[] = typeof jsonData === 'string' 
    ? JSON.parse(jsonData) 
    : jsonData;

  if (!Array.isArray(data)) {
    throw new Error('Invalid recipes data: expected array of recipes');
  }

  return data.map((recipe, index) => {
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
        parsedRecipe.summary = cleanHtml(recipe.summary.trim());
      }
      
      if (recipe.dishTypes && Array.isArray(recipe.dishTypes)) {
        parsedRecipe.dishTypes = recipe.dishTypes;
      }
      
      if (recipe.cuisines && Array.isArray(recipe.cuisines)) {
        parsedRecipe.cuisines = recipe.cuisines;
      }
      
      if (recipe.diets && Array.isArray(recipe.diets)) {
        parsedRecipe.diets = recipe.diets;
      }
      
      // Parse ingredients from extendedIngredients
      if (recipe.extendedIngredients && Array.isArray(recipe.extendedIngredients)) {
        parsedRecipe.ingredients = parseExtendedIngredients(recipe.extendedIngredients);
      }
      
      // Parse instructions from analyzedInstructions or instructions
      const parsedInstructions = parseInstructions(
        recipe.analyzedInstructions,
        recipe.instructions
      );
      if (parsedInstructions) {
        parsedRecipe.instructions = parsedInstructions;
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
      parsedRecipe.summary = cleanHtml(recipe.summary.trim());
    }
    
    if (recipe.dishTypes && Array.isArray(recipe.dishTypes)) {
      parsedRecipe.dishTypes = recipe.dishTypes;
    }
    
    if (recipe.cuisines && Array.isArray(recipe.cuisines)) {
      parsedRecipe.cuisines = recipe.cuisines;
    }
    
    if (recipe.diets && Array.isArray(recipe.diets)) {
      parsedRecipe.diets = recipe.diets;
    }
    
    // Parse ingredients from extendedIngredients
    if (recipe.extendedIngredients && Array.isArray(recipe.extendedIngredients)) {
      parsedRecipe.ingredients = parseExtendedIngredients(recipe.extendedIngredients);
    }
    
    // Parse instructions from analyzedInstructions or instructions
    const parsedInstructions = parseInstructions(
      recipe.analyzedInstructions,
      recipe.instructions
    );
    if (parsedInstructions) {
      parsedRecipe.instructions = parsedInstructions;
    }
    
    if (recipe.winePairing) {
      parsedRecipe.winePairing = recipe.winePairing;
    }
  }

  return parsedRecipe;
}

/**
 * Validates that a JSON string or object matches the expected backend JsonArray format
 * @param data - JSON string or object to validate
 * @returns true if valid, throws error if invalid
 */
export function validateRecipesFormat(data: any): boolean {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!Array.isArray(parsed)) {
      throw new Error('Data must be an array of recipes');
    }

    // Validate each recipe
    parsed.forEach((recipe: any, index: number) => {
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
