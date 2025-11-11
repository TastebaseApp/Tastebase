package tastebase.api.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tastebase.obj.Recipe;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;
import tastebase.obj.dto.UserDTO;

import java.util.Set;

@Service
public class UserService {

    public User getUser(UserPrincipal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user");
        }
        User user = principal.getUser();
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User not found");
        }
        return user;
    }

    public UserDTO getUserDTO(UserPrincipal principal) {
        User user = getUser(principal);
        return new UserDTO(user.getID(), user.getProvider(), user.getProviderID(), user.getName(), user.getEmail());
    }

    public void favoriteRecipe(User user, int recipeID) {
        Recipe recipe = RecipeService.getRecipe(recipeID);
        if (recipe == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        user.addFavorite(recipe);
    }

    public void deleteFavoriteRecipe(User user, int recipeID) {
        Recipe recipe = RecipeService.getRecipe(recipeID);
        if (recipe == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        user.removeFavorite(recipe);
    }
}
