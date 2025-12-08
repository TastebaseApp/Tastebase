/**
 * Recipe Ingredient Comparer Utility
 * Compares recipe ingredients against pantry items to determine availability
 */

import { Recipe, Pantry, Quantity, Ingredient } from '../types/pantry';
import { getStandardUnit } from './unitConverter';

/**
 * Detailed information about an ingredient's availability in the pantry
 */
export type IngredientAvailabilityDetail = {
  name: string;                     // name of the ingredient
  amountMissing: Quantity;          // In standard units, 0 if there is enough of the ingredient to meet the recipe needs
};

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
 * Calculates the missing amount between recipe and pantry quantities in standard units
 * @param recipeQuantity - The required quantity from the recipe
 * @param pantryQuantity - The available quantity in the pantry (null if ingredient is missing)
 * @returns The missing amount in standard units, or null if there's enough or units are incompatible
 */
function getMissingAmount(
  recipeQuantity: Quantity,
  pantryQuantity: Quantity | null
): { amount: number; unit: string } | null {
  try {
    const recipeStandard = getStandardUnit(recipeQuantity.amount, recipeQuantity.unit);

    // If pantry doesn't have the ingredient, return the full recipe amount in standard units
    if (!pantryQuantity) {
      return recipeStandard;
    }

    const pantryStandard = getStandardUnit(pantryQuantity.amount, pantryQuantity.unit);

    // If units don't match, can't compare (e.g., cups vs ounces)
    if (recipeStandard.unit !== pantryStandard.unit) {
      // Return full recipe amount as missing since we can't compare
      return recipeStandard;
    }

    // Calculate missing amount
    const missingAmount = recipeStandard.amount - pantryStandard.amount;

    // If there's enough or more, return 0 (no missing amount)
    if (missingAmount <= 0) {
      return { amount: 0, unit: recipeStandard.unit };
    }

    // Return the missing amount in standard units
    return {
      amount: missingAmount,
      unit: recipeStandard.unit
    };
  } catch (error) {
    // On error, assume full recipe amount is missing
    try {
      const recipeStandard = getStandardUnit(recipeQuantity.amount, recipeQuantity.unit);
      return recipeStandard;
    } catch {
      return null;
    }
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

/**
 * Compares a recipe's ingredients against pantry items and returns detailed information
 * about each ingredient's availability status
 * @param recipe - The recipe to check
 * @param pantry - The pantry to compare against
 * @returns An array of IngredientAvailabilityDetail objects, one for each recipe ingredient,
 *   with the ingredient name and the amount missing in standard units
 */
export function compareRecipeToPantryDetails(
  recipe: Recipe,
  pantry: Pantry
): IngredientAvailabilityDetail[] {

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return [];
  }

  const details: IngredientAvailabilityDetail[] = [];

  for (const recipeIngredient of recipe.ingredients) {
    const pantryIngredient = pantry.pantryItems.find(
      (item) => item.itemName.toLowerCase().trim() === recipeIngredient.itemName.toLowerCase().trim()
    );

    // Get missing amount in standard units
    const missingAmount = getMissingAmount(
      recipeIngredient.amount,
      pantryIngredient ? pantryIngredient.amount : null
    );

    // If null, convert to 0 amount (shouldn't happen based on getMissingAmount implementation, but handle it)
    const amountMissing: Quantity = missingAmount 
      ? { amount: missingAmount.amount, unit: missingAmount.unit }
      : { amount: 0, unit: 'unknown' };

    details.push({
      name: recipeIngredient.itemName,
      amountMissing: amountMissing
    });
  }

  return details;
}

