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
  reduceIngredient: (itemID: number, amountToSubtract: number) => Promise<void>;
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

    // Find the ingredient to get its current amount
    const ingredient = ingredients.find(i => i.itemID === id);
    const currentAmount = ingredient?.amount.amount ?? 0;
    
    // Calculate new quantity optimistically
    const newQty = currentAmount + amt;

    // Update local state immediately (optimistic update)
    setIngredients(prev => {
      const existingIndex = prev.findIndex(
        i => i.itemID === id || 
        (i.itemName.trim().toLowerCase() === name.trim().toLowerCase() && 
         i.amount.unit.trim().toLowerCase() === unit.trim().toLowerCase())
      );
      
      if (existingIndex !== -1) {
        // Update existing ingredient
        const updatedList = [...prev];
        updatedList[existingIndex] = {
          ...prev[existingIndex],
          amount: {
            ...prev[existingIndex].amount,
            amount: newQty
          }
        };
        console.log('[PantryContext] addIngredient - updated list (optimistic):', updatedList);
        return updatedList;
      } else {
        // Add new ingredient
        const newIngredient: Ingredient = {
          itemID: id,
          itemName: name,
          amount: { amount: newQty, unit },
        };
        console.log('[PantryContext] addIngredient - adding new ingredient (optimistic):', newIngredient);
        return [...prev, newIngredient];
      }
    });

    // Attempt to sync with backend in the background (don't block UI)
    try {
      await pantryService.addIngredient(id, newQty, unit, name, token);
      console.log('[PantryContext] addIngredient - backend sync successful');
    } catch (e: any) {
      // Log error but don't revert optimistic update
      console.warn('[PantryContext] addIngredient - backend sync failed (keeping optimistic update):', e?.message);
      // Don't reload - keep the optimistic update
    }
  };

  const reduceIngredient = async (itemID: number, amountToSubtract: number) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    // Find the ingredient to get its current amount and unit
    const ingredient = ingredients.find(i => i.itemID === itemID);
    if (!ingredient) {
      setError('Ingredient not found');
      return;
    }

    // Calculate new amount optimistically
    const newAmount = ingredient.amount.amount - amountToSubtract;
    const shouldRemove = newAmount <= 0;

    // Update local state immediately (optimistic update)
    setIngredients(prev => {
      if (shouldRemove) {
        console.log('[PantryContext] reduceIngredient - removing ingredient (amount <= 0)');
        return prev.filter(i => i.itemID !== itemID);
      }

      // Otherwise, update the ingredient with the new amount
      const existingIndex = prev.findIndex(i => i.itemID === itemID);
      if (existingIndex !== -1) {
        const updatedList = [...prev];
        updatedList[existingIndex] = {
          ...prev[existingIndex],
          amount: {
            ...prev[existingIndex].amount,
            amount: newAmount
          }
        };
        console.log('[PantryContext] reduceIngredient - updated list (optimistic):', updatedList);
        return updatedList;
      }

      return prev;
    });

    // Attempt to sync with backend in the background (don't block UI)
    try {
      await pantryService.reduceIngredient(itemID, newAmount, ingredient.amount.unit, token);
      console.log('[PantryContext] reduceIngredient - backend sync successful');
    } catch (e: any) {
      // Log error but don't revert optimistic update
      console.warn('[PantryContext] reduceIngredient - backend sync failed (keeping optimistic update):', e?.message);
      // Don't reload - keep the optimistic update
    }
  };

  const removeIngredient = async (itemID: number) => {
    console.log('[PantryContext] removeIngredient called with itemID:', itemID, 'type:', typeof itemID);
    
    if (!token) {
      setError('Authentication required');
      return;
    }

    // Remove from local state immediately (optimistic update)
    setIngredients(prev => {
      console.log('[PantryContext] removeIngredient - current ingredients before removal:', prev.map(i => ({ itemID: i.itemID, name: i.itemName })));
      const filtered = prev.filter(i => {
        const matches = i.itemID === itemID;
        console.log(`[PantryContext] Comparing ${i.itemID} (${typeof i.itemID}) === ${itemID} (${typeof itemID}): ${matches}`);
        return !matches;
      });
      console.log('[PantryContext] removeIngredient - filtered list (optimistic):', filtered.map(i => ({ itemID: i.itemID, name: i.itemName })));
      return filtered;
    });

    // Attempt to sync with backend in the background (don't block UI)
    try {
      await pantryService.removeIngredient(itemID, token);
      console.log('[PantryContext] removeIngredient - backend DELETE successful');
    } catch (e: any) {
      // Log error but don't revert optimistic update
      console.warn('[PantryContext] removeIngredient - backend DELETE failed (keeping optimistic update):', e?.message);
      // Don't reload - keep the optimistic update
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
    <PantryContext.Provider value={{ ingredients, loading, error, refresh: load, searchIngredient, addIngredient, reduceIngredient, removeIngredient }}>
      {children}
    </PantryContext.Provider>
  );
};

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used inside PantryProvider');
  return ctx;
}