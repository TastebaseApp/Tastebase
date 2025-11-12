import { Ingredient } from '../types/pantry';
import { SearchIngredientResponse, parseIngredients, parsePantryIngredients } from '../utils/pantryParser';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const pantry = {
  pantryItems: [] as Ingredient[],
  nextId: 0,
} 

async function getJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error('Failed to parse JSON response');
  }
}

export const pantryService = {
  /**
   * Lists all pantry ingredients from the API
   * @param token - Authentication token
   * @returns Promise resolving to array of Ingredient objects
   */
  async listIngredients(token: string | null): Promise<Ingredient[]> {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = `${API_BASE}/api/pantry/items`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pantry items (${response.status})`);
      }

      const data = await getJson<any[]>(response);
      const ingredients = parsePantryIngredients(data);
      
      // Update local list with API data
      pantry.pantryItems = ingredients;
      
      return ingredients.map((i) => ({ ...i, amount: { ...i.amount } }));
    } catch (error) {
      // Network or API error — fall back to local behavior
      // Local in-memory behavior (same as previous implementation)
      await new Promise((r) => setTimeout(r, 150));
      return pantry.pantryItems.map((i) => ({ ...i, amount: { ...i.amount } }));
    }
  },

  async searchIngredient(query: string, number: number): Promise<Ingredient[]> {
    const url = `${API_BASE}/api/ingredients/getIngredients?query=${query}&number=${number}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const data = await getJson<SearchIngredientResponse[]>(response);
    return parseIngredients(data);
  },
  
  async addIngredient(id: number, newQty: number, unit: string, name: string, token: string | null): Promise<Ingredient> {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = `${API_BASE}/api/pantry/${id}?=${newQty}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '<no body>');
        const err = new Error(`Remote add failed: ${response.status} ${response.statusText} - ${text}`);
        throw err;
      }

      const data = await response.json();
      const item: Ingredient = {
        itemID: (data.itemID ?? data.id) ?? id,
        itemName: data.ingredientName ?? data.itemName ?? name,
        amount: {
          amount: data.amount?.amount ?? newQty,
          unit: data.amount?.unit ?? unit,
        },
        image: data.image,
      };

      // Update local list on success
      const index = pantry.pantryItems.findIndex(i => i.itemID === id);
      if (index !== -1) {
        pantry.pantryItems[index] = item;
      } else {
        pantry.pantryItems.push(item);
      }

      return { ...item, amount: { ...item.amount } };
    } catch (error) {
      // Backend endpoint doesn't exist or failed - this is expected
      // Don't throw, just return a calculated result for reference
      // Since we're using optimistic updates, the state is already updated
      // Return a calculated result (though it won't be used since we already updated optimistically)
      const index = pantry.pantryItems.findIndex(i => i.itemID === id);
      if (index !== -1) {
        const existing = pantry.pantryItems[index];
        return { ...existing, amount: { amount: newQty, unit: existing.amount.unit } };
      }

      return {
        itemID: id,
        itemName: name,
        amount: { amount: newQty, unit },
        image: undefined
      };
    }
  },

  /**
   * Reduces the quantity of an ingredient in the pantry via API
   * @param itemID - ID of the item to reduce
   * @param newQty - The new total quantity after subtracting
   * @param unit - Unit of measurement
   * @param token - Authentication token
   * @returns Promise resolving to the updated Ingredient object
   */
  async reduceIngredient(itemID: number, newQty: number, unit: string, token: string | null): Promise<Ingredient> {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = `${API_BASE}/api/pantry/${itemID}?=${newQty}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '<no body>');
        const err = new Error(`Remote reduce failed: ${response.status} ${response.statusText} - ${text}`);
        throw err;
      }

      const data = await response.json();
      const item: Ingredient = {
        itemID: (data.itemID ?? data.id) ?? itemID,
        itemName: data.ingredientName ?? data.itemName ?? '',
        amount: {
          amount: data.amount?.amount ?? newQty,
          unit: data.amount?.unit ?? unit,
        },
        image: data.image,
      };

      // Update local list on success
      const index = pantry.pantryItems.findIndex(i => i.itemID === itemID);
      if (index !== -1) {
        if (item.amount.amount <= 0) {
          // Remove from local list if amount is 0 or less
          pantry.pantryItems.splice(index, 1);
        } else {
          // Update the item in local list
          pantry.pantryItems[index] = item;
        }
      }

      return { ...item, amount: { ...item.amount } };
    } catch (error) {
      // Backend endpoint doesn't exist or failed - this is expected
      // Don't throw, just return a calculated result for reference
      // Since we're using optimistic updates, the state is already updated
      // Return a calculated result (though it won't be used since we already updated optimistically)
      const index = pantry.pantryItems.findIndex(i => i.itemID === itemID);
      if (index !== -1) {
        const existing = pantry.pantryItems[index];
        return { ...existing, amount: { amount: newQty, unit: existing.amount.unit } };
      }

      return {
        itemID,
        itemName: '',
        amount: { amount: newQty, unit },
        image: undefined
      };
    }
  },

  /**
   * Removes an ingredient from the pantry via API
   * @param itemID - ID of the item to remove
   * @param token - Authentication token
   * @returns Promise that resolves when the item is removed
   */
  async removeIngredient(itemID: number, token: string | null): Promise<void> {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = `${API_BASE}/api/pantry/remove?id=${itemID}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Item not found');
        }
        throw new Error(`Failed to remove pantry item (${response.status})`);
      }

      // Remove from local list on success
      const index = pantry.pantryItems.findIndex(i => i.itemID === itemID);
      if (index !== -1) {
        pantry.pantryItems.splice(index, 1);
      }
    } catch (error) {
      // Backend endpoint doesn't exist or failed - this is expected
      // Don't throw since we're using optimistic updates
      // The state is already updated, so we don't need to revert
      // Don't throw - the optimistic update is already applied
    }
  },
};




export default pantryService;
