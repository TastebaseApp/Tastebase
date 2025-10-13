package tastebase.api.internal;

import com.google.gson.JsonArray;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tastebase.App;
import tastebase.api.service.RecipeService;
import tastebase.database.SQLConnector;
import tastebase.obj.Recipe;

@RestController
@RequestMapping("/api/recipes/")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/random")
    @Operation(summary = "Get a random recipe", description = "Returns a randomly selected recipe in its entirety.")
    public String getRandomRecipe() {
        Recipe recipe = recipeService.getRandomRecipe();
        if (recipe == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return recipe.toString();
    }

    @GetMapping("/search")
    @Operation(summary = "Search recipes", description = "Search for recipe snippets based on a comma-separated list of ingredients (E.g. ?ingredients=apples,flour,sugar).")
    public String searchRecipes(@RequestParam(required = false) String ingredients) {
        if (ingredients == null || ingredients.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No ingredients provided");
        }

        return recipeService.searchRecipesByIngredients(ingredients).toString();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find recipe by ID", description = "Returns a recipe in full based on the ID given.")
    public String getRecipeById(@PathVariable int id) {
        Recipe recipe = recipeService.getRecipeByID(id);
        if (recipe == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found.");
        return recipe.toString();
    }
}
