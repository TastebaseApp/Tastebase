package tastebase.obj;

import com.google.gson.Gson;
import com.google.gson.JsonArray;

import java.util.List;
import java.util.ArrayList;

public class Pantry {
    private int pantryID;
    private String pantryName;

    private final List<Item> pantryItems;
    
    public Pantry(int pantryID, String pantryName) {
        this.pantryID = pantryID;
        this.pantryName = pantryName;

        // putting this here for now, we are going to need to load items from the database later
        this.pantryItems = new ArrayList<>(); 
    }

    public boolean addItem(Item newItem) {
        for (Item i : pantryItems) {
            if (i.getItemID() == newItem.getItemID()) {
                return false; // item already exists
            }
        }
        pantryItems.add(newItem);
        return true; // item added
    }
    public boolean removeItem(int itemID) {
        for (Item i : pantryItems) {
            if (i.getItemID() == itemID) {
                pantryItems.remove(i);
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
        return pantryItems.size();
    }
    public JsonArray getJsonItems() {
        Gson gson = new Gson();
        return gson.toJsonTree(this.pantryItems).getAsJsonArray();
    }

    public void setPantryID(int newID) {
        this.pantryID = newID;
    }
    public void setName(String newName) {
        this.pantryName = newName;
    }

}
