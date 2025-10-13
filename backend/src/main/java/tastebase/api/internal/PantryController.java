package tastebase.api.internal;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tastebase.App;
import tastebase.api.service.PantryService;
import tastebase.obj.Item;

import java.util.List;

@Controller
@RequestMapping("/api/pantry/")
public class PantryController {
    private final PantryService pantryService;

    public PantryController(PantryService pantryService) {
        this.pantryService = pantryService;
    }

    // Pantry API
    @GetMapping("/items")
    @Operation(summary = "Get pantry items", description = "Returns a json list of all the pantry items.")
    public List<Item> getPantryItems() {
        return pantryService.getItems();
    }

    @PutMapping("/add")
    @Operation(summary = "Add an item", description = "Add an individual item to the pantry.")
    public Boolean addPantryItem(@RequestParam int id,
                                 @RequestParam String name,
                                 @RequestParam double amount,
                                 @RequestParam String unit
    ) {
        return pantryService.addItem(id, name, amount, unit);
        // update db logic next
    }

    @DeleteMapping("/remove")
    @Operation(summary = "Remove an item", description = "Removes an individual pantry item by ID.")
    public Boolean removePantryItem(@RequestParam int id) {
        if (pantryService.removeItem(id))
            return true;
        else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}
