import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Ingredient } from '../types/pantry';
import pantryService from '../services/pantryService';
import { useAuth } from './AuthContext';

const MAX_INGREDIENTS = 10;

type ContextShape = {
  ingredients: Ingredient[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  searchIngredient: (query: string) => Promise<Ingredient[]>;
  addIngredient: (id: number, amt: number, unit: string, name: string) => Promise<void>;
  removeIngredient: (itemID: number) => Promise<void>;
};

const PantryContext = createContext<ContextShape | undefined>(undefined);

export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { token } = useAuth();

  const load = useCallback(async () => {
    if (!token) {
      setIngredients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);
    try {
      const list = await pantryService.listIngredients(token);
      setIngredients(list);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const searchIngredient = async (query: string) => {
    if (!token) {
      setError('Authentication required');
      return [];
    }
    try {
      const list = await pantryService.searchIngredient(query, MAX_INGREDIENTS);
      return list;
    } catch (e: any) {
      setError(e?.message ?? 'Failed to search ingredients');
      return [];
    }
  };

  const addIngredient = async (id: number, amt: number, unit: string, name: string) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const updated = await pantryService.addIngredient(id, amt, unit, name, token);
      // Reload ingredients to get the latest state from the server
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to add ingredient');
    }
  };

  const removeIngredient = async (itemID: number) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      await pantryService.removeIngredient(itemID, token);
      // Remove from local state immediately for better UX
      setIngredients(prev => prev.filter(i => i.itemID !== itemID));
      // Optionally reload to ensure sync, but immediate update is usually better
    } catch (e: any) {
      setError(e?.message ?? 'Failed to remove ingredient');
      // Reload on error to sync state
      await load();
    }
  };

  useEffect(() => {
    if (token) {
      load();
    } else {
      setLoading(false);
    }
  }, [token, load]);

  return (
    <PantryContext.Provider value={{ ingredients, loading, error, refresh: load, searchIngredient, addIngredient, removeIngredient }}>
      {children}
    </PantryContext.Provider>
  );
};

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used inside PantryProvider');
  return ctx;
}