package tastebase.api.service;

import com.google.gson.JsonElement;
import org.springframework.stereotype.Service;
import tastebase.App;
import tastebase.api.external.SpoonacularService;

import java.util.List;

@Service
public class IngredientService {

    private final SpoonacularService spoonacularService;

    public IngredientService(SpoonacularService spoonacularService) {
        this.spoonacularService = spoonacularService;
    }

    public List<JsonElement> searchIngredients(String query, int number) {
        return spoonacularService.searchIngredients(query, number);
    }
}
