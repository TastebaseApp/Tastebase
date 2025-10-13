package tastebase.api.service;

import com.google.gson.JsonArray;
import org.springframework.stereotype.Service;
import tastebase.obj.Item;
import tastebase.obj.Pantry;

import java.util.List;

@Service
public class PantryService {
    // Temporarily hold everything in shared pantry.
    private Pantry pantry = new Pantry(1, "Shared Pantry");

    public boolean addItem(int id, String name, double amount, String unit) {
        return pantry.addItem(new Item(id, name, amount, unit));
    }

    public boolean removeItem(int id) {
        return pantry.removeItem(id);
    }

    public List<Item> getItems() {
        return pantry.getItems();
    }
}
