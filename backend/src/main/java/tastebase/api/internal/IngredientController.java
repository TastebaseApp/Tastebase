package tastebase.api.internal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tastebase.api.external.SpoonacularService;
import tastebase.api.service.IngredientService;

@RestController
@RequestMapping("/api/ingredients/")
@Tag(name = "Ingredients", description = "Endpoints for ingredient searching")
public class IngredientController {
    IngredientService ingredientService = new IngredientService();

    @GetMapping("/getIngredients")
    @Operation(summary = "Get a list of potential Ingredients from a query and amount returned", description = "Return a json list of potential ingredients")
    public String getIngredients(@RequestParam String query, @RequestParam Integer number) {
        var ingredients = ingredientService.searchIngredients(query, number);
        if (ingredients == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return ingredients.toString();
    }
}
