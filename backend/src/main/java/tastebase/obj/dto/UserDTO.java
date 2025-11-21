package tastebase.obj.dto;

public class UserDTO {

    private final int ID;
    private final String provider;
    private final String providerID;

    private final String name;
    private final String email;
    private final String picture;

    public UserDTO(int ID, String provider, String providerID, String name, String email, String picture) {
        this.ID = ID;
        this.provider = provider;
        this.providerID = providerID;
        this.name = name;
        this.email = email;
        this.picture = picture;
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

    public String getPicture() {
        return picture;
    }
}
