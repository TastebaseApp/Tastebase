package tastebase.api.service;

import com.google.gson.JsonArray;
import org.springframework.stereotype.Service;
import tastebase.database.PantryDAO;
import tastebase.database.TrieDAO;
import tastebase.obj.Ingredient;
import tastebase.obj.Pantry;
import tastebase.util.Trie;

import java.util.List;

@Service
public class PantryService {
    // Temporarily hold everything in shared pantry.
    private final Trie ingredientTrie;

    public PantryService() {
        ingredientTrie = TrieDAO.load();
    }

    private boolean pantryExists(int pantryId) {
        return PantryDAO.exists(pantryId);
    }

    public boolean addItem(Pantry pantry, Ingredient ingredient) {
        if (pantry.addItem(ingredient)) {
            savePantry(pantry);
            return true;
        }
        return false;
    }

    public boolean removeItem(Pantry pantry, int id) {
        if (pantry.removeItem(id)) {
            savePantry(pantry);
            return true;
        }
        return false;
    }

    public List<Ingredient> getItems(Pantry pantry) {
        return pantry.getItems();
    }

    private void savePantry(Pantry pantry) {
        PantryDAO.upsert(pantry);
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
