package tastebase.api.internal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tastebase.api.external.Cuisine;
import tastebase.api.external.NutrientFilter;
import tastebase.api.service.RecipeService;
import tastebase.obj.Recipe;

import java.util.Arrays;
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
    public String searchRecipes(
            @RequestParam(required = false) String ingredients,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Cuisine cuisine,
            @RequestParam(required = false) NutrientFilter nutrientFilter, // Due to GetMapping RequestParam is the only way to keep this optional
            @RequestParam(required = false) Integer number
    ) {
        if (ingredients == null || ingredients.isEmpty())
            if (query == null || query.isEmpty())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        return recipeService.searchRecipes(query, ingredients, cuisine, nutrientFilter, number).toString();
    }

    @GetMapping("/search/cuisine")
    @Operation(summary = "Search recipes by cuisine", description = "Search for recipes filtered by cuisine type.")
    public String searchRecipesByCuisine(
        @RequestParam String cuisine,
        @RequestParam(required = false, defaultValue = "10") Integer number) {
        
        int resultNumber = (number != null && number > 0) ? number : 10;
        
        // Convert cuisine string to enum
        Cuisine cuisineEnum;
        try {
            // Handle both underscore and space formats, make case-insensitive
            String normalizedCuisine = cuisine.trim().replace(" ", "_");
            // Find matching enum value (case-insensitive)
            Cuisine matchedCuisine = null;
            for (Cuisine c : Cuisine.values()) {
                if (c.name().equalsIgnoreCase(normalizedCuisine)) {
                    matchedCuisine = c;
                    break;
                }
            }
            if (matchedCuisine == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Invalid cuisine: " + cuisine + ". Valid cuisines: " + 
                    Arrays.toString(Cuisine.values()));
            }
            cuisineEnum = matchedCuisine;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Invalid cuisine: " + cuisine + ". Error: " + e.getMessage());
        }
        
        return recipeService.searchRecipes(null, null, cuisineEnum, resultNumber).toString();
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
