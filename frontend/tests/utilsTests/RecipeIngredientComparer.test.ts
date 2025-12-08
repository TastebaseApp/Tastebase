/**
 * Jest test file for RecipeIngredientComparer
 * 
 * Run tests with: npm test
 * Run in watch mode: npm run test:watch
 * Run with coverage: npm run test:coverage
 */

import { compareRecipeToPantry, compareRecipeToPantryDetails } from '../../utils/recipeIngredientComparer';
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

describe('compareRecipeToPantryDetails', () => {
  it('Return all ingredients with amountMissing 0 when pantry has enough of everything', () => {
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      name: 'Flour',
      amountMissing: { amount: 0, unit: 'cups' }
    });
    expect(result[1]).toEqual({
      name: 'Milk',
      amountMissing: { amount: 0, unit: 'cups' }
    });
    expect(result[2]).toEqual({
      name: 'Eggs',
      amountMissing: { amount: 0, unit: 'pieces' }
    });
  });

  it('Return amountMissing 0 for exact amount match', () => {
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
        { itemID: 1, itemName: 'Sugar', amount: { amount: 1, unit: 'cup' } }
      ]
    };
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Sugar',
      amountMissing: { amount: 0, unit: 'cups' }
    });
  });

  it('Return full recipe amount in standard units for ingredients not in pantry', () => {
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      name: 'Flour',
      amountMissing: { amount: 0, unit: 'cups' }
    });
    expect(result[1]).toEqual({
      name: 'Milk',
      amountMissing: { amount: 1.5, unit: 'cups' }
    });
    expect(result[2]).toEqual({
      name: 'Eggs',
      amountMissing: { amount: 2, unit: 'pieces' }
    });
  });

  it('Return difference in standard units when pantry has ingredient but not enough quantity', () => {
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'Flour',
      amountMissing: { amount: 0, unit: 'cups' }
    });
    expect(result[1]).toEqual({
      name: 'Milk',
      amountMissing: { amount: 0.5, unit: 'cups' } // 1.5 - 1 = 0.5
    });
  });

  it('Return empty array for empty recipe', () => {
    const recipe: Recipe = { id: 1, title: 'Empty Recipe' };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: []
    };
    const result = compareRecipeToPantryDetails(recipe, pantry);
    expect(result).toEqual([]);
  });

  it('Return empty array for recipe with no ingredients', () => {
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    expect(result).toEqual([]);
  });

  it('Return full recipe amount in standard units for incompatible units (cups vs ounces)', () => {
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Flour',
      amountMissing: { amount: 2, unit: 'cups' } // Full recipe amount since units incompatible
    });
  });

  it('Return full recipe amount in standard units for all ingredients when pantry is empty', () => {
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'Flour',
      amountMissing: { amount: 2, unit: 'cups' }
    });
    expect(result[1]).toEqual({
      name: 'Milk',
      amountMissing: { amount: 1, unit: 'cups' }
    });
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Butter',
      amountMissing: { amount: 0, unit: 'cups' }
    });
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
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Flour',
      amountMissing: { amount: 0, unit: 'cups' }
    });
  });

  it('Handle mixed scenario with missing, insufficient, and sufficient ingredients', () => {
    const recipe: Recipe = {
      id: 1,
      title: 'Complex Recipe',
      ingredients: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 2, unit: 'cups' } },      // Sufficient
        { itemID: 2, itemName: 'Milk', amount: { amount: 1.5, unit: 'cups' } },     // Insufficient
        { itemID: 3, itemName: 'Eggs', amount: { amount: 2, unit: 'pieces' } },    // Missing
        { itemID: 4, itemName: 'Sugar', amount: { amount: 0.5, unit: 'cups' } }    // Sufficient
      ]
    };
    const pantry: Pantry = {
      pantryID: 1,
      pantryName: 'Test Pantry',
      pantryItems: [
        { itemID: 1, itemName: 'Flour', amount: { amount: 3, unit: 'cups' } },      // Enough
        { itemID: 2, itemName: 'Milk', amount: { amount: 1, unit: 'cups' } },       // Not enough
        { itemID: 4, itemName: 'Sugar', amount: { amount: 1, unit: 'cup' } }       // Enough
        // Eggs missing
      ]
    };
    const result = compareRecipeToPantryDetails(recipe, pantry);
    
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      name: 'Flour',
      amountMissing: { amount: 0, unit: 'cups' }
    });
    expect(result[1]).toEqual({
      name: 'Milk',
      amountMissing: { amount: 0.5, unit: 'cups' } // 1.5 - 1 = 0.5
    });
    expect(result[2]).toEqual({
      name: 'Eggs',
      amountMissing: { amount: 2, unit: 'pieces' } // Full recipe amount
    });
    expect(result[3]).toEqual({
      name: 'Sugar',
      amountMissing: { amount: 0, unit: 'cups' }
    });
  });
});
