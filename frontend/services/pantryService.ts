import { Item, Pantry } from '../types/pantry';

let nextId = 100;
const pantry: Pantry = {
  pantryID: 1,
  pantryName: 'Main Pantry',
  pantryItems: [
    // { itemID: nextId++, itemName: 'Flour', amount: { amount: 1, unit: 'kg' } },
    // { itemID: nextId++, itemName: 'Salt', amount: { amount: 0.5, unit: 'kg' } },
  ],
};



export const pantryService = {
  async listItems(): Promise<Item[]> {
    await new Promise((r) => setTimeout(r, 150));
    return pantry.pantryItems.map((i) => ({ ...i, amount: { ...i.amount } }));
  },
  async addItem(amt: number, unit: string, name: string): Promise<Item> { // Realistically we would need to doublecheck everything against the API here. Same for remove.
    console.log('[pantryService] addItem called', { amt, unit, name });

    const url = "https://tastebase.dylanpriebe.cc/api/pantry/add";

    const token = "AUTH-TOKEN"; // Replace with actual token retrieval logic

    const body = {
      ingredientId: 2, // Need to find a way to retrieve ID
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
        itemID: (data.itemID ?? data.id) || nextId++,
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
        itemID: nextId++,
        itemName: name,
        amount: { amount: amt, unit: unit },
      };

      return { ...newItem, amount: { ...newItem.amount } };
    }
  },
  async removeAmount(itemID: number, amt: number): Promise<Item | null> {
    await new Promise((r) => setTimeout(r, 120));
    const item = pantry.pantryItems.find(i => i.itemID === itemID);
    if (!item) throw new Error('Item not found');
    item.amount.amount -= amt;
    if (item.amount.amount <= 0) {
      pantry.pantryItems = pantry.pantryItems.filter(i => i.itemID !== itemID);
      return null;
    }
    return { ...item, amount: { ...item.amount } };
  },
};




export default pantryService;
