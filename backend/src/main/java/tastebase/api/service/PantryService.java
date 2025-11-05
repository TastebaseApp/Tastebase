package tastebase.api.service;

import org.springframework.stereotype.Service;
import tastebase.database.PantryDAO;
import tastebase.obj.Ingredient;
import tastebase.obj.Pantry;

import java.util.List;

@Service
public class PantryService {

    public PantryService() {

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
}
