package tastebase.api;

import tastebase.obj.Item;
import tastebase.obj.Pantry;

import com.google.gson.JsonArray;

public class PantryHandler {
    private final Pantry myPantry;

    public PantryHandler() {
        this.myPantry = new Pantry(1, "test Pantry");
    }

    public boolean addRequest(int id, String name, double amount, String unit) {
        return this.myPantry.addItem(new Item(id, name, amount, unit));
    }
    public boolean removeRequest(int id) {
        return this.myPantry.removeItem(id);
    }
    public JsonArray getlistRequest() {
        return myPantry.getJsonItems();
    }
}
