package tastebase.api.service;

import com.google.gson.JsonArray;
import org.springframework.stereotype.Service;
import tastebase.App;
import tastebase.api.external.Cuisine;
import tastebase.api.external.NutrientFilter;
import tastebase.api.external.SpoonacularService;
import tastebase.database.SQLConnector;
import tastebase.obj.Recipe;

import javax.management.Query;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

@Service
public class RecipeService {

    private final PantryService pantryService;
    private final SpoonacularService spoonacularService;

    public RecipeService(PantryService pantryService, SpoonacularService spoonacularService) {
        this.pantryService = pantryService;
        this.spoonacularService = spoonacularService;
    }

    public List<Recipe> getRandomRecipes(int number) {
        List<Recipe> recipes = spoonacularService.getRandomRecipes(number);

        for (Recipe recipe : recipes) {
            saveRecipe(recipe);
        }

        return recipes;
    }

    public Recipe getRecipeByID(int id) {
        if (hasRecipe(id)) return getRecipe(id);
        Recipe recipe = spoonacularService.getRecipe(id);
        saveRecipe(recipe);
        return recipe;
    }

    public JsonArray searchRecipes(String query, String ingredients, Cuisine cuisine, NutrientFilter nutrientFilter, int number) {
        JsonArray results = new JsonArray();
        for (var recipe : spoonacularService.getRecipes(query, ingredients, cuisine, nutrientFilter, number)) {
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
