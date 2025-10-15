import { Item, Quantity } from '../types/pantry';

// Backend JSON types for ingredients
export interface BackendIngredientAmount {
  metric: {
    unit: string;
    value: number;
  };
  us: {
    unit: string;
    value: number;
  };
}

export interface BackendIngredient {
  amount: BackendIngredientAmount;
  image: string;
  name: string;
  id?: number; // Optional ID field that might be present in JSON
}

export interface BackendIngredientsResponse {
  ingredients: BackendIngredient[];
}

// Parser configuration
export interface ParserConfig {
  useMetricUnits?: boolean; // true for metric, false for US units
  providedIds?: number[]; // optional array of IDs to use (in order of ingredients)
}

/**
 * Parses backend ingredients JSON and converts to frontend Item format
 * @param jsonData - The backend ingredients JSON response
 * @param config - Optional configuration for parsing behavior
 * @returns Array of Item objects compatible with frontend types
 */
export function parseIngredients(
  jsonData: BackendIngredientsResponse | string,
  config: ParserConfig = {}
): Item[] {
  const {
    useMetricUnits = true,
    providedIds = []
  } = config;

  // Parse JSON string if needed
  const data: BackendIngredientsResponse = typeof jsonData === 'string' 
    ? JSON.parse(jsonData) 
    : jsonData;

  if (!data.ingredients || !Array.isArray(data.ingredients)) {
    throw new Error('Invalid ingredients data: expected array of ingredients');
  }

  return data.ingredients.map((ingredient, index) => {
    // Validate ingredient structure
    if (!ingredient.name || !ingredient.amount) {
      throw new Error(`Invalid ingredient at index ${index}: missing name or amount`);
    }

    // Choose unit system
    const amountData = useMetricUnits ? ingredient.amount.metric : ingredient.amount.us;
    
    // Create quantity object
    const quantity: Quantity = {
      amount: amountData.value,
      unit: amountData.unit || 'unit' // fallback for empty units
    };

    // Determine item ID with priority order:
    // 1. ID from JSON data (if present)
    // 2. ID from providedIds array (if available)
    // 3. 0 (fallback)
    let itemId: number;
    
    if (ingredient.id !== undefined && ingredient.id !== null) {
      // Use ID from JSON data
      itemId = ingredient.id;
    } else if (providedIds.length > index && providedIds[index] !== undefined) {
      // Use provided ID for this index
      itemId = providedIds[index];
    } else {
      // Fallback to 0
      itemId = 0;
    }

    // Create item object
    const item: Item = {
      itemID: itemId,
      itemName: ingredient.name.trim(),
      amount: quantity
    };

    return item;
  });
}

/**
 * Parses a single ingredient from backend format
 * @param ingredient - Single backend ingredient object
 * @param itemId - Optional ID to assign to the item (will use ingredient.id if not provided)
 * @param useMetricUnits - Whether to use metric or US units
 * @returns Item object compatible with frontend types
 */
export function parseSingleIngredient(
  ingredient: BackendIngredient,
  itemId?: number,
  useMetricUnits: boolean = true
): Item {
  if (!ingredient.name || !ingredient.amount) {
    throw new Error('Invalid ingredient: missing name or amount');
  }

  const amountData = useMetricUnits ? ingredient.amount.metric : ingredient.amount.us;
  
  const quantity: Quantity = {
    amount: amountData.value,
    unit: amountData.unit || 'unit'
  };

  // Use ingredient.id if available, otherwise use provided itemId, fallback to 0
  const finalItemId = ingredient.id !== undefined && ingredient.id !== null 
    ? ingredient.id 
    : (itemId !== undefined ? itemId : 0);

  return {
    itemID: finalItemId,
    itemName: ingredient.name.trim(),
    amount: quantity
  };
}

/**
 * Validates that a JSON string or object matches the expected backend format
 * @param data - JSON string or object to validate
 * @returns true if valid, throws error if invalid
 */
export function validateIngredientsFormat(data: any): boolean {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Data must be an object');
    }

    if (!parsed.ingredients || !Array.isArray(parsed.ingredients)) {
      throw new Error('Data must contain an "ingredients" array');
    }

    parsed.ingredients.forEach((ingredient: any, index: number) => {
      if (!ingredient.name || typeof ingredient.name !== 'string') {
        throw new Error(`Ingredient at index ${index} must have a valid "name" string`);
      }

      if (!ingredient.amount || typeof ingredient.amount !== 'object') {
        throw new Error(`Ingredient at index ${index} must have an "amount" object`);
      }

      if (!ingredient.amount.metric || !ingredient.amount.us) {
        throw new Error(`Ingredient at index ${index} must have both "metric" and "us" amount data`);
      }

      const { metric, us } = ingredient.amount;
      
      if (typeof metric.value !== 'number' || typeof metric.unit !== 'string') {
        throw new Error(`Ingredient at index ${index} metric amount must have numeric value and string unit`);
      }

      if (typeof us.value !== 'number' || typeof us.unit !== 'string') {
        throw new Error(`Ingredient at index ${index} US amount must have numeric value and string unit`);
      }

      // Validate optional id field if present
      if (ingredient.id !== undefined && ingredient.id !== null && typeof ingredient.id !== 'number') {
        throw new Error(`Ingredient at index ${index} id must be a number if provided`);
      }
    });

    return true;
  } catch (error) {
    throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Utility function to convert between metric and US units for an existing Item
 * @param item - Item to convert
 * @param useMetricUnits - true for metric, false for US
 * @param backendData - Original backend data to get conversion values
 * @returns New Item with converted units
 */
export function convertItemUnits(
  item: Item,
  useMetricUnits: boolean,
  backendData: BackendIngredientsResponse
): Item {
  const ingredient = backendData.ingredients.find(ing => 
    ing.name.toLowerCase().trim() === item.itemName.toLowerCase().trim()
  );

  if (!ingredient) {
    console.warn(`Could not find backend data for ingredient: ${item.itemName}`);
    return item; // Return original if no match found
  }

  const amountData = useMetricUnits ? ingredient.amount.metric : ingredient.amount.us;
  
  return {
    ...item,
    amount: {
      amount: amountData.value,
      unit: amountData.unit || 'unit'
    }
  };
}

// Default export for convenience
export default {
  parseIngredients,
  parseSingleIngredient,
  validateIngredientsFormat,
  convertItemUnits
};
