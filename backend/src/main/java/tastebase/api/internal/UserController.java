package tastebase.api.internal;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tastebase.api.service.RecipeService;
import tastebase.api.service.UserService;
import tastebase.obj.Recipe;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;
import tastebase.obj.dto.UserDTO;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/user")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "User", description = "Endpoints for user management")
public class UserController {

    private final UserService userService;
    private final RecipeService recipeService;

    public UserController(UserService userService, RecipeService recipeService) {
        this.userService = userService;
        this.recipeService = recipeService;
    }

    @GetMapping
    public UserDTO getUser(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal) {
        return userService.getUserDTO(principal);
    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<?> getAvatar(@PathVariable int id) {
        return userService.getAvatar(id);
    }

    @PutMapping("/favorites/{recipeID}")
    public ResponseEntity<Void> putFavoriteRecipe(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal, @PathVariable int recipeID) {
        userService.favoriteRecipe(userService.getUser(principal), recipeID);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    public List<Map<String, Object>> getFavoriteRecipes(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal) {
        return userService.getFavorites(userService.getUser(principal));
    }

    @DeleteMapping("/favorites/{recipeID}")
    public ResponseEntity<Void> deleteFavoriteRecipe(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal, @PathVariable int recipeID) {
        userService.deleteFavoriteRecipe(userService.getUser(principal), recipeID);
        return ResponseEntity.noContent().build();
    }
}
