import { Item } from '../types/pantry';
import { parsePantryItems } from '../utils/pantryParser';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const pantry = {
  pantryItems: [] as Item[],
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
   * Lists all pantry items from the API
   * @param token - Authentication token
   * @returns Promise resolving to array of Item objects
   */
  async listItems(token: string | null): Promise<Item[]> {
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
      const items = parsePantryItems(data);
      
      // Update local list with API data
      pantry.pantryItems = items;
      
      return items.map((i) => ({ ...i, amount: { ...i.amount } }));
    } catch (error) {
      // Network or API error — fall back to local behavior but surface the
      // error in the console so it's visible during development.
      // eslint-disable-next-line no-console
      console.error("Failed to fetch items via API, using local fallback:", error);

      // Local in-memory behavior (same as previous implementation)
      await new Promise((r) => setTimeout(r, 150));
      return pantry.pantryItems.map((i) => ({ ...i, amount: { ...i.amount } }));
    }
  },
  async addItem(id: number, amt: number, unit: string, name: string, token: string | null): Promise<Item> { // Realistically we would need to doublecheck everything against the API here. Same for remove.
    console.log('[pantryService] addItem called', { amt, unit, name, id });
    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = `${API_BASE}/api/pantry/add`;

    const body = {
      ingredientId: id, // Need to find a way to retrieve ID
      ingredientName: name,
      amount: { amount: amt, unit },
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '<no body>');
        const err = new Error(`Remote add failed: ${response.status} ${response.statusText} - ${text}`);
        console.error('pantryService.addItem:', err);
        throw err;
      }

      const data = await response.json();
      const item: Item = {
        itemID: (data.itemID ?? data.id) || pantry.nextId++,
        itemName: data.ingredientName ?? data.itemName ?? name,
        amount: {
          amount: data.amount?.amount ?? amt,
          unit: data.amount?.unit ?? unit,
        },
      };

      const keyName = item.itemName.trim().toLowerCase().replace(/\s+/g, " ");
      const keyUnit = item.amount.unit.trim().toLowerCase().replace(/\s+/g, " ");

      const existing = pantry.pantryItems.find(
        (i) =>
          i.itemID === item.itemID ||
          (i.itemName.trim().toLowerCase().replace(/\s+/g, " ") === keyName &&
            i.amount.unit.trim().toLowerCase().replace(/\s+/g, " ") === keyUnit)
      );

      if (existing) {
        Object.assign(existing, item);
        return { ...existing, amount: { ...existing.amount } };
      }

      pantry.pantryItems.push(item);
      return { ...item, amount: { ...item.amount } };
    } catch (error) {
      // Network or API error — fall back to local behavior but surface the
      // error in the console so it's visible during development.
      // eslint-disable-next-line no-console
      console.error("Failed to add item via API, using local fallback:", error);

      // local in-memory behavior (same as previous implementation)
      await new Promise((r) => setTimeout(r, 150));

      const keyName = name.trim().toLowerCase().replace(/\s+/g, " ");
      const keyUnit = unit.trim().toLowerCase().replace(/\s+/g, " ");

      const existing = pantry.pantryItems.find(
        (i) =>
          i.itemName.trim().toLowerCase().replace(/\s+/g, " ") === keyName &&
          i.amount.unit.trim().toLowerCase().replace(/\s+/g, " ") === keyUnit
      );

      if (existing) {
        existing.amount.amount += amt;
        return { ...existing, amount: { ...existing.amount } };
      }

      const newItem: Item = {
        itemID: pantry.nextId++,
        itemName: name,
        amount: { amount: amt, unit: unit },
      };

      return { ...newItem, amount: { ...newItem.amount } };
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
      // Network or API error — fall back to local behavior but surface the
      // error in the console so it's visible during development.
      // eslint-disable-next-line no-console
      console.error("Failed to remove item via API, using local fallback:", error);

      // Local in-memory behavior (same as previous implementation)
      await new Promise((r) => setTimeout(r, 120));
      
      const index = pantry.pantryItems.findIndex(i => i.itemID === itemID);
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      pantry.pantryItems.splice(index, 1);
    }
  },
};




export default pantryService;
