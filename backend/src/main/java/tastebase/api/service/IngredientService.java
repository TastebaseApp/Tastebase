package tastebase.api.service;

import com.google.gson.JsonElement;
import tastebase.App;

import java.util.List;

public class IngredientService {

    public IngredientService() {

    }

    public List<JsonElement> searchIngredients(String query, int number) {
        return App.getSpoonacularService().searchIngredients(query, number);
    }
}
