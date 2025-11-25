package tastebase.api.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.reflect.TypeToken;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tastebase.api.internal.RecipeController;
import tastebase.database.UserDAO;
import tastebase.obj.Recipe;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;
import tastebase.obj.dto.UserDTO;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final RecipeService recipeService;

    public UserService(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

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
        return new UserDTO(user.getID(), user.getProvider(), user.getProviderID(), user.getName(), user.getEmail(), user.getPicture());
    }

    public void favoriteRecipe(User user, int recipeID) {
        if (recipeService.getRecipeByID(recipeID) == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        user.addFavorite(recipeID);
        UserDAO.saveFavorite(user, recipeID);
    }

    public void deleteFavoriteRecipe(User user, int recipeID) {
        user.removeFavorite(recipeID);
        UserDAO.deleteFavorite(user, recipeID);
    }

    public List<Map<String, Object>> getFavorites(User user) {
        JsonArray jsonArray = new JsonArray();

        user.getFavorites().forEach(favorite -> {
            jsonArray.add(recipeService.getRecipeByID(favorite).getFullRecipe());
        });

        return new Gson().fromJson(
                jsonArray,
                new TypeToken<List<Map<String, Object>>>(){}.getType()
        );
    }
}
