package tastebase.obj;

import java.util.HashSet;
import java.util.UUID;

public class User {
    private int ID;
    private String provider;
    private String providerID;

    private String name;
    private String email;

    HashSet<Recipe> favorites;

    public User() {
        this.favorites = new HashSet<>();
    }

    public User(int ID, String name, String email) {
        this.ID = ID;
        this.name = name;
        this.email = email;
        this.favorites = new HashSet<>();
    }


    public String getProvider() {
        return provider;
    }
    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderID() {
        return providerID;
    }
    public void setProviderID(String providerID) {
        this.providerID = providerID;
    }


    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public int getID() {
        return ID;
    }
    public void setID(int ID) {
        this.ID = ID;
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
