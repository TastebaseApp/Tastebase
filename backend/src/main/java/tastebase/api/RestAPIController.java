package tastebase.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.springframework.web.bind.annotation.*;
import tastebase.App;
import tastebase.database.SQLConnector;
import tastebase.obj.Pantry;
import tastebase.obj.Recipe;

@RestController
@RequestMapping("/api")
public class RestAPIController {

    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @GetMapping("/recipes")
    public String getRecipes() {
        return "Use /recipes/random for a random recipe or /recipes/search?ingredients=ing1,ing2 for searching by ingredients, or /recipes/{id} for a specific recipe by ID.";
    }

    @GetMapping("/recipes/random")
    public String getRandomRecipe() {
        Recipe recipe = App.getSpoonacularService().getRandomRecipe();
        SQLConnector.saveRecipe(recipe);
        return recipe.toString();
    }

    @GetMapping("/recipes/search")
    public String searchRecipes(@RequestParam(required = false) String ingredients) {
        if (ingredients == null || ingredients.isEmpty()) {
            return "No ingredients provided, provide as comma-separated list. E.g., ?ingredients=apples,flour,sugar";
        } else {
            JsonArray results = new JsonArray();
            for (var recipe : App.getSpoonacularService().getRecipes(ingredients)) {
                results.add(recipe);
            }
            return results.toString();
        }
    }

    @GetMapping("/recipes/{id}")
    public String getRecipeById(@PathVariable int id) {
        if (SQLConnector.hasRecipe(id)) {
            Recipe recipe = SQLConnector.getRecipe(id);
            if (recipe != null) {
                return recipe.toString();
            }
        }
        Recipe recipe = App.getSpoonacularService().getRecipe(id);
        if (recipe != null) {
            SQLConnector.saveRecipe(recipe);
            return recipe.toString();
        }
        return "Recipe not found.";
    }

    // Pantry API
    @GetMapping("/pantry/items")
    public String getPantryItems() {
        return App.getPantryHandler().getlistRequest().toString();
    }

    @PutMapping("/pantry/add")
    public Boolean addPantryItem(@RequestParam int id,
                                @RequestParam String name,
                                @RequestParam double amount,
                                @RequestParam String unit
    ) {
        return App.getPantryHandler().addRequest(id, name, amount, unit);
        // update db logic next
    }

    @DeleteMapping("/pantry/remove")
    public Boolean removePantryItem(@RequestParam int id) {
        return App.getPantryHandler().removeRequest(id);
    }
}
