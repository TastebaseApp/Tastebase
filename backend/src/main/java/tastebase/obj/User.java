package tastebase.obj;

import tastebase.database.PantryDAO;

import java.util.HashSet;
import java.util.Set;

public class User {
    private int ID;
    private String provider;
    private String providerID;

    private String name;
    private String email;

    private Set<Integer> favorites;
    private Pantry pantry;

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
        this.favorites.add(favorite.getId());
    }
    public void removeFavorite(Recipe favorite) {
        this.favorites.remove(favorite.getId());
    }
    public void addFavorite(int id) {
        this.favorites.add(id);
    }
    public void removeFavorite(int id) {
        this.favorites.remove(id);
    }
    public Set<Integer> getFavorites() {
        return favorites;
    }
    public void setFavorites(Set<Integer> favorites) {
        this.favorites = favorites;
    }

    public Pantry getPantry() {
        if (pantry == null) {
            if (PantryDAO.exists(ID)) {
                pantry = PantryDAO.getPantry(ID);
            } else {
                pantry = new Pantry(ID, getEmail());
                PantryDAO.upsert(pantry);
            }
        }
        return pantry;
    }
    public void setPantry(Pantry pantry) {
        this.pantry = pantry;
        PantryDAO.upsert(pantry);
    }
    public void addIngredient(Ingredient ingredient) {
        getPantry().addItem(ingredient);
    }
    public boolean removeIngredient(Ingredient ingredient) {
        if (getPantry().removeItem(ingredient.getIngredientId())) {
            PantryDAO.upsert(getPantry());
            return true;
        }
        return false;
    }
}
