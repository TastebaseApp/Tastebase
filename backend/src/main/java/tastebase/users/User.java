package tastebase.users;

import tastebase.obj.Recipe;
import java.util.HashSet;

public class User {
    int userId;
    String name;
    HashSet<Recipe> favorites;

    public User(int userId, String name, HashSet<Recipe> favorites) {
        this.userId = userId;
        this.name = name;
        this.favorites = favorites;
    }

    public String getName() {
        return name;
    }
    public int getUserId() {
        return userId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addFavorite(Recipe favorite) {
        this.favorites.add(favorite);
    }
    public boolean removeFavorite(Recipe favorite) {
        return this.favorites.remove(favorite);
    }

    public HashSet<Recipe> getFavorites() {
        return favorites;
    }
}
