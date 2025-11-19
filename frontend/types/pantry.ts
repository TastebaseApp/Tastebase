export type Quantity = { amount: number; unit: string };

export type Ingredient = {
  itemID: number;
  itemName: string;
  amount: Quantity;
  image?: string;
  possibleUnits?: string[];
};

export type Pantry = {
  pantryID: number;
  pantryName: string;
  pantryItems: Ingredient[];
};

export type Recipe = {
  id: number;
  title: string;
  image?: string;
  servings?: number;
  readyInMinutes?: number;
  summary?: string;
  dishTypes?: string[];          // e.g. ["dinner","main course"]
  ingredients?: Ingredient[];          // simplified from extendedIngredients
  instructions?: string;         // plain text combined from analyzedInstructions
  cuisines?: string[];           // e.g. ["European","Irish"]
  diets?: string[];              // e.g. ["lacto ovo vegetarian"]
  winePairing?: {
    pairedWines?: string[];
    pairingText?: string;
  } | null;
};