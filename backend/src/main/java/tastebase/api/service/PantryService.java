package tastebase.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.reflect.TypeToken;
import org.springframework.stereotype.Service;
import tastebase.database.SQLConnector;
import tastebase.App;
import tastebase.App;
import tastebase.database.TrieDAO;
import tastebase.obj.Item;
import tastebase.obj.Pantry;
import tastebase.obj.Recipe;
import tastebase.util.Trie;

import java.sql.PreparedStatement;
import java.util.List;

@Service
public class PantryService {
    // Temporarily hold everything in shared pantry.
    private Pantry pantry = new Pantry(1, "Shared Pantry");

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final Trie ingredientTrie;

    public PantryService() {
        if (!pantryExists(pantry.getPantryID())) {
            initPantry();
        }

        ingredientTrie = TrieDAO.load();
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
                this.pantry.setItems(parseItems(rs.getString("Items")));

                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    private List<Item> parseItems(String json) {
        if (json == null || json.isBlank()) return List.of();
        
        Gson gson = new Gson();
        var type = new TypeToken<List<Item>>() {}.getType();
        return gson.fromJson(json, type);
    }

    public boolean addItem(int id, String name, double amount, String unit) {
        if (pantry.addItem(new Item(id, name, amount, unit))) {
            savePantry();
            return true;
        }
        return false;
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
            String itemsJson = MAPPER.writeValueAsString(this.pantry.getItems());
            ps.setString(3, itemsJson); ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void savePantry() {
        String statement = "UPDATE pantries SET Name = ?, Items = ? WHERE ID = ?";
        try (PreparedStatement ps = SQLConnector.getConnection().prepareStatement(statement)) {
            ps.setString(1, this.pantry.getPantryName());
            String itemsJson = MAPPER.writeValueAsString(this.pantry.getItems());
            ps.setString(2, itemsJson);
            ps.setInt(3, this.pantry.getPantryID());
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public JsonArray searchIngredients(String query) {
        JsonArray results = new JsonArray();
        for (var ingredient : ingredientTrie.suggest(query, 25)) {
            results.add(ingredient);
        }
        return results;
    }

    public void addIngredientToTrie(String ingredient) {
        if (!ingredientTrie.search(ingredient)) {
            ingredientTrie.insert(ingredient);
            TrieDAO.insert(ingredient);
        };
    }
}
