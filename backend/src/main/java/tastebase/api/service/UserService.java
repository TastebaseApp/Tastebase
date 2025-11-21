package tastebase.api.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tastebase.database.UserDAO;
import tastebase.obj.Recipe;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;
import tastebase.obj.dto.UserDTO;

import java.sql.SQLException;
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
        return new UserDTO(user.getID(), user.getProvider(), user.getProviderID(), user.getName(), user.getEmail(), user.getPicture());
    }

    public void favoriteRecipe(User user, int recipeID) {
        user.addFavorite(recipeID);
        UserDAO.saveFavorite(user, recipeID);
    }

    public void deleteFavoriteRecipe(User user, int recipeID) {
        user.removeFavorite(recipeID);
        UserDAO.deleteFavorite(user, recipeID);
    }
}
