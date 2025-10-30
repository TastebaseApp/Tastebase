package tastebase.api.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.stereotype.Service;
import tastebase.App;
import tastebase.database.SQLConnector;
import tastebase.obj.Recipe;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Service
public class RecipeService {

    private final PantryService pantryService;

    public RecipeService(PantryService pantryService) {
        this.pantryService = pantryService;
    }

    public Recipe getRandomRecipe() {
        Recipe recipe = App.getSpoonacularService().getRandomRecipe();
        saveRecipe(recipe);
        return recipe;
    }

    public Recipe getRecipeByID(int id) {
        if (hasRecipe(id)) return getRecipe(id);
        Recipe recipe = App.getSpoonacularService().getRecipe(id);
        saveRecipe(recipe);
        return recipe;
    }

    public JsonArray searchRecipesByIngredients(String ingredients) {
        JsonArray results = new JsonArray();
        for (var recipe : App.getSpoonacularService().getRecipes(ingredients)) {
            results.add(recipe);
        }
        return results;
    }

    public static Recipe getRecipe(int id) {
        String statement = "SELECT * FROM recipes WHERE ID = " + id;
        try {
            ResultSet rs = SQLConnector.executeQuery(statement);
            if (rs.next()) {
                String fullRecipe = rs.getString("FullRecipe");
                return new Recipe(com.google.gson.JsonParser.parseString(fullRecipe).getAsJsonObject());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void saveRecipe(Recipe recipe) {
        String statement = "INSERT INTO recipes (ID, Title, FullRecipe) VALUES (?, ?, ?)";
        try (PreparedStatement ps = SQLConnector.getConnection().prepareStatement(statement)) {
            ps.setInt(1, recipe.getId());
            ps.setString(2, recipe.getTitle());
            ps.setString(3, recipe.getFullRecipe().toString());
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        for (var element : recipe.getFullRecipe().getAsJsonArray("extendedIngredients")) {
            JsonObject ingredient = element.getAsJsonObject();
            pantryService.addIngredientToTrie(ingredient.get("nameClean").getAsString());
        }
    }

    public static boolean hasRecipe(int id) {
        String statement = "SELECT * FROM recipes WHERE ID = " + id;

        try {
            ResultSet rs = SQLConnector.executeQuery(statement);
            if (rs.next()) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
