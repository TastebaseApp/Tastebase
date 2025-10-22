package tastebase.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public PantryService() {
        if (!pantryExists(pantry.getPantryID())) {
            initPantry();
        }
    }

    private boolean pantryExists(int pantryId) {
        String statement = "SELECT ID, Name, Items FROM pantries WHERE ID = ? LIMIT 1";
        try (var conn = SQLConnector.getConnection(); var ps = conn.prepareStatement(statement)) {
            ps.setInt(1, pantryId);
            try (var rs = ps.executeQuery()) {
                if (!rs.next()) return false;

                // load our pantry's values from db
                this.pantry.setPantryID(rs.getInt("ID"));
                this.pantry.setName(rs.getString("Name"));
                String itemsText = rs.getString("Items");
                this.pantry.setItems(parseItems(itemsText));

                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    private java.util.List<Item> parseItems(String json) {
        if (json == null || json.isBlank()) return new java.util.ArrayList<>();
        var type = new com.google.gson.reflect.TypeToken<java.util.List<Item>>(){}.getType();
        return new com.google.gson.Gson().fromJson(json, type);
    }

    public boolean addItem(int id, String name, double amount, String unit) {
        if (pantry.addItem(new Item(id, name, amount, unit))) {
            savePantry();
            return true;
        }
        else return false;
    }

    public boolean removeItem(int id) {
        if (pantry.removeItem(id)) {
            savePantry();
            return true;
        }
        return false;
    }

    public List<Item> getItems() {
        return pantry.getItems();
    }

    private void initPantry() {
        String statement = "INSERT INTO pantries (ID, Name, Items) VALUES (?, ?, ?)";
        try (PreparedStatement ps = SQLConnector.getConnection().prepareStatement(statement)) {
            ps.setInt(1, this.pantry.getPantryID());
            ps.setString(2, this.pantry.getPantryName());
            ObjectMapper mapper = new ObjectMapper();
            String itemsJson = mapper.writeValueAsString(this.pantry.getItems());
            ps.setString(3, itemsJson); ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void savePantry() {
        String statement = "UPDATE pantries SET Name = ?, Items = ? WHERE ID = ?";
        try (PreparedStatement ps = SQLConnector.getConnection().prepareStatement(statement)) {
            ps.setString(1, this.pantry.getPantryName());
            ObjectMapper mapper = new ObjectMapper();
            String itemsJson = mapper.writeValueAsString(this.pantry.getItems());
            ps.setString(2, itemsJson);
            ps.setInt(3, this.pantry.getPantryID()); // WHERE clause uses ID
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
