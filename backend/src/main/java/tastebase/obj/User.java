package tastebase.obj;

import java.util.HashSet;
import java.util.UUID;

public class User {
    private UUID userId;
    private String name;
    private String email;
    HashSet<Recipe> favorites;

    public User(UUID userId, String name, String email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.favorites = new HashSet<>();
    }

    public User(UUID userId, String name, String email, HashSet<Recipe> favorites) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.favorites = favorites;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public UUID getUserId() {
        return userId;
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
