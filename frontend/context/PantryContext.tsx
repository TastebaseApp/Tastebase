import React, { createContext, useContext, useEffect, useState } from 'react';
import { Item } from '../types/pantry';
import pantryService from '../services/pantryService';

type ContextShape = {
  items: Item[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  addItem: (amt: number, unit: string, name: string) => Promise<void>;
  removeAmount: (itemID: number, amt: number) => Promise<void>;
};

const PantryContext = createContext<ContextShape | undefined>(undefined);

export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const list = await pantryService.listItems();
      setItems(list);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (amt: number, unit: string, name: string) => {
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
    const updated = await pantryService.addItem(amt, unit, name);
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.itemID === updated.itemID ||
          (norm(i.itemName) === norm(updated.itemName) &&
            norm(i.amount.unit) === norm(updated.amount.unit))
      );
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const removeAmount = async (itemID: number, amt: number) => {
    if (!(amt > 0)) return;
    const updated = await pantryService.removeAmount(itemID, amt);
    setItems(prev =>
      updated
        ? prev.map(i => (i.itemID === updated.itemID ? updated : i))
        : prev.filter(i => i.itemID !== itemID)
    );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PantryContext.Provider value={{ items, loading, error, refresh: load, addItem, removeAmount }}>
      {children}
    </PantryContext.Provider>
  );
};

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used inside PantryProvider');
  return ctx;
}
