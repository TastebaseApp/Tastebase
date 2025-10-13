package tastebase.api.service;

import com.google.gson.JsonArray;
import org.springframework.stereotype.Service;
import tastebase.App;
import tastebase.database.SQLConnector;
import tastebase.obj.Recipe;

@Service
public class RecipeService {
    public Recipe getRandomRecipe() {
        Recipe recipe = App.getSpoonacularService().getRandomRecipe();
        SQLConnector.saveRecipe(recipe);
        return recipe;
    }

    public Recipe getRecipeByID(int id) {
        if (SQLConnector.hasRecipe(id)) return SQLConnector.getRecipe(id);
        Recipe recipe = App.getSpoonacularService().getRecipe(id);
        SQLConnector.saveRecipe(recipe);
        return recipe;
    }

    public JsonArray searchRecipesByIngredients(String ingredients) {
        JsonArray results = new JsonArray();
        for (var recipe : App.getSpoonacularService().getRecipes(ingredients)) {
            results.add(recipe);
        }
        return results;
    }
}
