// pantryTypeHelper.ts

// Adjust the import path to wherever you defined your types
import type { Ingredient, Quantity, Recipe, Pantry } from "@/types/pantry";

/**
 * Create a Quantity object.
 */
export function createQuantity(amount: number, unit: string): Quantity {
  return { amount, unit };
}

/**
 * Create an Ingredient object.
 * `overrides` lets you pass optional fields like image, possibleUnits.
 */
export function createIngredient(
  itemID: number,
  itemName: string,
  amount: Quantity,
  overrides: Partial<Omit<Ingredient, "itemID" | "itemName" | "amount">> = {}
): Ingredient {
  return {
    itemID,
    itemName,
    amount,
    ...overrides,
  };
}

/**
 * Create an empty Pantry with a name.
 */
export function createPantry(pantryID: number, pantryName: string): Pantry {
  return {
    pantryID,
    pantryName,
    pantryItems: [],
  };
}

/**
 * Create a basic Recipe.
 * Most fields are optional and can be passed via `overrides`.
 */
export function createRecipe(
  id: number,
  title: string,
  overrides: Partial<Omit<Recipe, "id" | "title">> = {}
): Recipe {
  return {
    id,
    title,
    ...overrides,
  };
}

/**
 * Add an ingredient to a pantry immutably.
 * Returns a new Pantry object.
 */
export function addIngredientToPantry(
  pantry: Pantry,
  ingredient: Ingredient
): Pantry {
  return {
    ...pantry,
    pantryItems: [...pantry.pantryItems, ingredient],
  };
}

/**
 * Remove an ingredient from a pantry by itemID (immutable).
 */
export function removeIngredientFromPantry(
  pantry: Pantry,
  itemID: number
): Pantry {
  return {
    ...pantry,
    pantryItems: pantry.pantryItems.filter((ing) => ing.itemID !== itemID),
  };
}

/**
 * Update the quantity of an ingredient in the pantry (immutable).
 * If not found, pantry is returned unchanged.
 */
export function updateIngredientQuantityInPantry(
  pantry: Pantry,
  itemID: number,
  newAmount: Quantity
): Pantry {
  return {
    ...pantry,
    pantryItems: pantry.pantryItems.map((ing) =>
      ing.itemID === itemID ? { ...ing, amount: newAmount } : ing
    ),
  };
}

/**
 * Find an ingredient in a pantry by name (case-insensitive).
 */
export function findIngredientInPantry(
  pantry: Pantry,
  name: string
): Ingredient | undefined {
  const lower = name.toLowerCase();
  return pantry.pantryItems.find(
    (ing) => ing.itemName.toLowerCase() === lower
  );
}

/**
 * Create a small sample pantry for testing/demo purposes.
 */
export function createSamplePantry(): Pantry {
  const pantry = createPantry(1, "Main Pantry");

  const eggs = createIngredient(
    1,
    "Eggs",
    createQuantity(12, "pcs"),
    { image: "eggs.png" }
  );

  const milk = createIngredient(
    2,
    "Milk",
    createQuantity(1, "l"),
    { possibleUnits: ["ml", "l"] }
  );

  const flour = createIngredient(
    3,
    "Flour",
    createQuantity(1000, "g")
  );

  return [eggs, milk, flour].reduce(
    (p, ing) => addIngredientToPantry(p, ing),
    pantry
  );
}

/**
 * Create a small sample recipe for testing/demo purposes.
 */
export function createSampleRecipe(): Recipe {
  const ingredients: Ingredient[] = [
    createIngredient(1, "Eggs", createQuantity(3, "pcs")),
    createIngredient(2, "Milk", createQuantity(200, "ml")),
    createIngredient(3, "Flour", createQuantity(100, "g")),
  ];

  return createRecipe(1, "Pancakes", {
    servings: 2,
    readyInMinutes: 15,
    ingredients,
    dishTypes: ["breakfast", "main course"],
    cuisines: ["American"],
    diets: ["vegetarian"],
    winePairing: null,
  });
}
