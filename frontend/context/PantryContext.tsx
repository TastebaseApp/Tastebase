import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Ingredient } from "../types/pantry";
import pantryService from "../services/pantryService";
import { useAuth } from "./AuthContext";

const MAX_INGREDIENTS = 10;

type ContextShape = {
  ingredients: Ingredient[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  searchIngredient: (query: string) => Promise<Ingredient[]>;
  addIngredient: (
    id: number,
    amt: number,
    unit: string,
    name: string
  ) => Promise<void>;
  setIngredient: (itemID: number, newAmount: number, unit: string) => Promise<void>;
  removeIngredient: (itemID: number) => Promise<void>;
};

const PantryContext = createContext<ContextShape | undefined>(undefined);

export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const searchIngredient = async (query: string) => {
    if (!token) {
      setError("Authentication required");
      return [];
    }
    try {
      const list = await pantryService.searchIngredient(query, MAX_INGREDIENTS);
      return list;
    } catch (e: any) {
      setError(e?.message ?? "Failed to search ingredients");
      return [];
    }
  };

  const addIngredient = async (
    id: number,
    amt: number,
    unit: string,
    name: string
  ) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    // Find the ingredient to get its current amount
    const ingredient = ingredients.find((i) => i.itemID === id);
    const currentAmount = ingredient?.amount.amount ?? 0;

    // Calculate new quantity optimistically
    const newQty = currentAmount + amt;

    // Update local state immediately (optimistic update)
    setIngredients((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.itemID === id ||
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
            amount: newQty,
          },
        };
        return updatedList;
      } else {
        // Add new ingredient
        const newIngredient: Ingredient = {
          itemID: id,
          itemName: name,
          image: `https://spoonacular.com/cdn/ingredients_250x250/${name
            .toLowerCase()
            .replace(/ /g, "-")}.jpg`,
          amount: { amount: newQty, unit },
        };
        return [...prev, newIngredient];
      }
    });

    // Attempt to sync with backend in the background (don't block UI)
    try {
      await pantryService.addIngredient(id, newQty, unit, name, token);
    } catch (e: any) {
      // Don't revert optimistic update on error
      // Don't reload - keep the optimistic update
    }
  };

  const setIngredient = async (itemID: number, newAmount: number, unit: string) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    // Find the ingredient to get its current amount and unit
    const ingredient = ingredients.find((i) => i.itemID === itemID);
    if (!ingredient) {
      setError("Ingredient not found");
      return;
    }

    // Calculate new amount optimistically
    const shouldRemove = newAmount <= 0;

    // Update local state immediately (optimistic update)
    setIngredients((prev) => {
      if (shouldRemove) {
        return prev.filter((i) => i.itemID !== itemID);
      }

      // Otherwise, update the ingredient with the new amount
      const existingIndex = prev.findIndex((i) => i.itemID === itemID);
      if (existingIndex !== -1) {
        const updatedList = [...prev];
        updatedList[existingIndex] = {
          ...prev[existingIndex],
          amount: {
            ...prev[existingIndex].amount,
            amount: newAmount,
          },
        };
        return updatedList;
      }

      return prev;
    });

    // Attempt to sync with backend in the background (don't block UI)
    try {
      if (shouldRemove) {
        // If amount is 0 or below, call DELETE API to remove the ingredient
        await pantryService.removeIngredient(itemID, token);
      } else {
        await pantryService.setIngredient(
          itemID,
          newAmount,
          ingredient.amount.unit,
          token
        );
      }
    } catch (e: any) {
      // Don't revert optimistic update on error
      // Don't reload - keep the optimistic update
    }
  };

  const removeIngredient = async (itemID: number) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    // Remove from local state immediately (optimistic update)
    setIngredients((prev) => prev.filter((i) => i.itemID !== itemID));

    // Attempt to sync with backend in the background (don't block UI)
    try {
      await pantryService.removeIngredient(itemID, token);
    } catch (e: any) {
      // Don't revert optimistic update on error
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
    <PantryContext.Provider
      value={{
        ingredients,
        loading,
        error,
        refresh: load,
        searchIngredient,
        addIngredient,
        setIngredient,
        removeIngredient,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
};

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error("usePantry must be used inside PantryProvider");
  return ctx;
}
