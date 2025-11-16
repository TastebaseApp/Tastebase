/**
 * Recipe Ingredient Comparer Utility
 * Compares recipe ingredients against pantry items to determine availability
 */

import { Recipe, Pantry, Quantity } from '../types/pantry';
import { getStandardUnit } from './unitConverter';

/**
 * Helper function to check if pantry has enough quantity of an ingredient
 * @param recipeQuantity - The required quantity from the recipe
 * @param pantryQuantity - The available quantity in the pantry
 * @returns true if pantry has sufficient quantity (>= recipe requirement), false otherwise
 */
function isEnough(recipeQuantity: Quantity, pantryQuantity: Quantity): boolean {
  try {
    // Convert both quantities to standard units for comparison
    const recipeStandard = getStandardUnit(recipeQuantity.amount, recipeQuantity.unit);
    const pantryStandard = getStandardUnit(pantryQuantity.amount, pantryQuantity.unit);

    // If units don't match, can't compare (e.g., cups vs ounces)
    if (recipeStandard.unit !== pantryStandard.unit) {
      return false;
    }

    return pantryStandard.amount >= recipeStandard.amount;
  } catch (error) {
    return false;
  }
}

/**
 * Compares a recipe's ingredients against pantry items
 * @param recipe - The recipe to check
 * @param pantry - The pantry to compare against
 * @returns A tuple [availableCount, totalCount] where:
 *   - availableCount: number of ingredients that are in pantry AND have sufficient quantity
 *   - totalCount: total number of ingredients required by the recipe
 */
export function compareRecipeToPantry(
  recipe: Recipe,
  pantry: Pantry
): [number, number] {

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return [0, 0];
  }

  const totalIngredients = recipe.ingredients.length;
  let availableCount = 0;

  for (const recipeIngredient of recipe.ingredients) {
    const pantryIngredient = pantry.pantryItems.find(
      (item) => item.itemName.toLowerCase().trim() === recipeIngredient.itemName.toLowerCase().trim()
    );

    // If ingredient is found in pantry, check if quantity is sufficient
    if (pantryIngredient && isEnough(recipeIngredient.amount, pantryIngredient.amount)) {
      availableCount++;
    }
  }

  return [availableCount, totalIngredients];
}

