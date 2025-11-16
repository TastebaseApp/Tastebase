/**
 * Jest test file for RecipeIngredientComparer
 * 
 * Run tests with: npm test
 * Run in watch mode: npm run test:watch
 * Run with coverage: npm run test:coverage
 */

import { compareRecipeToPantry } from '../../utils/recipeIngredientComparer';
import { Recipe, Pantry } from '../../types/pantry';

describe('compareRecipeToPantry', () => {
  it('Return [3, 3] when all ingredients are available with sufficient quantity', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Pancakes',
      ingredients: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 2, unit: 'cups' } },
        { itemID: 2, itemName: 'Milk', amount: { amount: 1.5, unit: 'cups' } },
        { itemID: 3, itemName: 'Eggs', amount: { amount: 2, unit: 'pieces' } }
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 3, unit: 'cups' } },
        { itemID: 2, itemName: 'Milk', amount: { amount: 2, unit: 'cups' } },
        { itemID: 3, itemName: 'Eggs', amount: { amount: 4, unit: 'pieces' } }
      ]
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([3, 3]);
  });

  it('Return [1, 1] for exact amount match', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Recipe',
      ingredients: [
        { itemID: 1, itemName: 'Sugar', amount: { amount: 1, unit: 'cup' } }
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'Sugar', amount: { amount: 1, unit: 'cup' } } // Exact match
      ]
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([1, 1]);
  });

  it('Return [1, 3] when some ingredients are missing from pantry', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Pancakes',
      ingredients: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 2, unit: 'cups' } },
        { itemID: 2, itemName: 'Milk', amount: { amount: 1.5, unit: 'cups' } },
        { itemID: 3, itemName: 'Eggs', amount: { amount: 2, unit: 'pieces' } }
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 3, unit: 'cups' } }
        // Milk and Eggs missing
      ]
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([1, 3]);
  });

  it('Return [1, 2] when some ingredients have insufficient quantity', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Pancakes',
      ingredients: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 2, unit: 'cups' } },
        { itemID: 2, itemName: 'Milk', amount: { amount: 1.5, unit: 'cups' } }
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 3, unit: 'cups' } }, // Enough
        { itemID: 2, itemName: 'Milk', amount: { amount: 1, unit: 'cups' } }   // Not enough (1 < 1.5)
      ]
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([1, 2]);
  });

  it('Return [0, 0] for empty recipe', () => {
    const recipe: Recipe = { id: 1, title: 'Empty Recipe' };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: []
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([0, 0]);
  });

  it('Return [0, 0] for recipe with no ingredients', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'No Ingredients',
      ingredients: []
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: []
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([0, 0]);
  });

  it('Return [0, 1] for incompatible units (cups vs ounces)', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Recipe',
      ingredients: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 2, unit: 'cups' } }
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 100, unit: 'ounces' } } // Different unit family
      ]
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([0, 1]);
  });

  it('Handle empty pantry correctly', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Recipe',
      ingredients: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 2, unit: 'cups' } },
        { itemID: 2, itemName: 'Milk', amount: { amount: 1, unit: 'cup' } }
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Empty Pantry',
      pantryItems: []
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([0, 2]);
  });

  it('Handle unit conversion correctly (tablespoons to cups)', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Recipe',
      ingredients: [
        { itemID: 1, itemName: 'Butter', amount: { amount: 8, unit: 'tablespoons' } } // 8 tbsp = 0.5 cups
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'Butter', amount: { amount: 1, unit: 'cup' } } // 1 cup > 0.5 cups
      ]
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([1, 1]);
  });

  it('Match ingredients case-insensitively', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Recipe',
      ingredients: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 2, unit: 'cups' } }
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'FLOUR', amount: { amount: 3, unit: 'cups' } } // Different case
      ]
    };
    expect(compareRecipeToPantry(recipe, pantry)).toEqual([1, 1]);
  });
});
