export type Quantity = { amount: number; unit: string };

export type Item = {
  itemID: number;
  itemName: string;
  amount: Quantity;
};

export type Pantry = {
  pantryID: number;
  pantryName: string;
  pantryItems: Item[];
};

export type Recipe = {
  id: number;
  title: string;
  image?: string;
  servings?: number;
  readyInMinutes?: number;
  summary?: string;
  dishTypes?: string[];          // e.g. ["dinner","main course"]
  ingredients?: Item[];          // simplified from extendedIngredients
  instructions?: string;         // plain text combined from analyzedInstructions
  winePairing?: {
    pairedWines?: string[];
    pairingText?: string;
  } | null;
};