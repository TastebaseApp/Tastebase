package tastebase.api.service;

import com.google.gson.JsonArray;
import org.springframework.stereotype.Service;
import tastebase.database.SQLConnector;
import tastebase.obj.Item;
import tastebase.obj.Pantry;
import tastebase.obj.Recipe;

import java.sql.PreparedStatement;
import java.util.List;

@Service
public class PantryService {
    // Temporarily hold everything in shared pantry.
    private Pantry pantry = new Pantry(1, "Shared Pantry");

    public boolean addItem(int id, String name, double amount, String unit) {
        if (pantry.addItem(new Item(id, name, amount, unit))) {
            savePantry();
            return true;
        }
        else return false;
    }

    public boolean removeItem(int id) {
        return pantry.removeItem(id);
    }

    public List<Item> getItems() {
        return pantry.getItems();
    }

    private void savePantry() {
        String statement = "INSERT INTO pantries (ID, Name, Items) VALUES (?, ?, ?)";
        try (PreparedStatement ps = SQLConnector.getConnection().prepareStatement(statement)) {
            ps.setInt(1, this.pantry.getPantryID());
            ps.setString(2, this.pantry.getPantryName());
            ps.setString(3, this.pantry.getItems().toString());
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
