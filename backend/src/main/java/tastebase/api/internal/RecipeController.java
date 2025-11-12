package tastebase.api.internal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tastebase.api.service.RecipeService;
import tastebase.obj.Recipe;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/")
@Tag(name = "Recipes", description = "Endpoints for recipe searching")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/random")
    @Operation(summary = "Get random recipes", description = "Returns a list of randomly selected recipes in its entirety.")
    public String getRandomRecipe(@RequestParam (name = "number", defaultValue = "10") int number) {
        List<Recipe> recipes = recipeService.getRandomRecipes(number);
        if (recipes == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return recipes.toString();
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
