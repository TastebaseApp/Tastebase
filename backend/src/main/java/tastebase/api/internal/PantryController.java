package tastebase.api.internal;

import com.google.gson.JsonArray;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tastebase.api.service.PantryService;
import tastebase.obj.Ingredient;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/pantry")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Pantry", description = "Endpoints for pantry management")
public class PantryController {
    private final PantryService pantryService;

    public PantryController(PantryService pantryService) {
        this.pantryService = pantryService;
    }

    @GetMapping("/items")
    @Operation(summary = "Get pantry items", description = "Returns a json list of all the pantry items.")
    public List<Ingredient> getPantryItems(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();
        return pantryService.getItems(user.getPantry());
    }

    @PutMapping("/add")
    @Operation(summary = "Add an item", description = "Add an individual item to the pantry.")
    public Boolean addPantryItem(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Ingredient ingredient) {
        return pantryService.addItem(userPrincipal.getUser().getPantry(), ingredient);
    }

    @PatchMapping("/patch")
    @Operation(summary = "Patch an Item", description = "Update the values of an item OR add the item")
    public void patchPantryItem(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Ingredient ingredient) {
        pantryService.patchItem(userPrincipal.getUser().getPantry(), ingredient);
    }

    @DeleteMapping("/remove")
    @Operation(summary = "Remove an item", description = "Removes an individual pantry item by ID.")
    public Boolean removePantryItem(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam int id) {
        if (pantryService.removeItem(userPrincipal.getUser().getPantry(), id))
            return true;
        else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}
