package tastebase.obj.dto;

import tastebase.obj.Pantry;
import tastebase.obj.Recipe;

import java.util.HashSet;

public class UserDTO {

    private final int ID;
    private final String provider;
    private final String providerID;

    private final String name;
    private final String email;

    public UserDTO(int ID, String provider, String providerID, String name, String email) {
        this.ID = ID;
        this.provider = provider;
        this.providerID = providerID;
        this.name = name;
        this.email = email;
    }

    public int getID() {
        return ID;
    }

    public String getProvider() {
        return provider;
    }

    public String getProviderID() {
        return providerID;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
