package tastebase.obj;

import java.util.List;
import java.util.ArrayList;

public class Pantry {
    private int pantryID;
    private String pantryName;

    private List<Ingredient> pantryIngredients;
    
    public Pantry(int pantryID, String pantryName) {
        this.pantryID = pantryID;
        this.pantryName = pantryName;

        // putting this here for now, we are going to need to load items from the database later
        this.pantryIngredients = new ArrayList<>();
    }

    public boolean addItem(Ingredient newIngredient) {
        for (Ingredient i : pantryIngredients) {
            if (i.getIngredientId() == newIngredient.getIngredientId()) {
                return false; // item already exists
            }
        }
        pantryIngredients.add(newIngredient);
        return true; // item added
    }
    public boolean removeItem(int itemID) {
        for (Ingredient i : pantryIngredients) {
            if (i.getIngredientId() == itemID) {
                pantryIngredients.remove(i);
                return true; // item removed
            }
        }
        return false; // item not found
    }

    public int getPantryID() {
        return pantryID;
    }
    public String getPantryName() {
        return pantryName;
    }
    public int getItemCount() {
        return pantryIngredients.size();
    }

    public List<Ingredient> getItems() {
        return pantryIngredients;
    }

    public void setPantryID(int newID) {
        this.pantryID = newID;
    }
    public void setName(String newName) {
        this.pantryName = newName;
    }
    public void setItems(List<Ingredient> newIngredients) {
        this.pantryIngredients = newIngredients;
    }
}
