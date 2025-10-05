import { Recipe } from '../types/pantry';

// In-memory storage for recipes.
let nextId = 100; // Counter for assigning unique IDs to new recipes.
let recipes: Recipe[] = [
  // Initial recipes...
];

export const recipeService = {
  // Function to list all recipes.
  async listRecipes(): Promise<Recipe[]> {
    await new Promise((r) => setTimeout(r, 150)); // Simulate a delay for asynchronous behavior.
    return recipes.map((r) => ({ ...r, ingredients: r.ingredients?.map(i => ({ ...i, amount: { ...i.amount } })) }));
  },

  // Function to add a new recipe to the in-memory storage.
  async addRecipe(newRecipe: Recipe): Promise<void> {
    newRecipe.id = nextId++; // Assign a unique ID to the new recipe.
    recipes.push(newRecipe); // Add the recipe to the in-memory list.
    console.log('Recipe added:', newRecipe); // Log the added recipe for debugging.
  },
};

export default recipeService;