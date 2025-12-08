package tastebase.api.internal;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.reflect.TypeToken;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tastebase.api.external.Cuisine;
import tastebase.api.external.NutrientFilter;
import tastebase.api.service.RecipeService;
import tastebase.obj.Recipe;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    public Object searchRecipes(
            @RequestParam(required = false) String ingredients,
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) Cuisine cuisine,
            @RequestParam(required = false, defaultValue = "10") int number,
            @RequestParam(required = false) NutrientFilter nutrientFilter
    ) {
        return new Gson().fromJson(
                recipeService.searchRecipes(query, ingredients, cuisine, nutrientFilter, number),
                List.class);
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