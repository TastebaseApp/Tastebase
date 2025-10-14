package tastebase.obj;

import com.google.gson.JsonObject;

import java.net.http.HttpResponse;

public final class Recipe {

    private int id;
    private String title;
    private String image;
    private JsonObject fullRecipe;

    public Recipe(JsonObject fullRecipe) {
        this.id = fullRecipe.get("id").getAsInt();
        this.title = fullRecipe.get("title").getAsString();
        this.image = fullRecipe.get("image").getAsString();
        this.fullRecipe = fullRecipe;
    }

    public Recipe(HttpResponse<String> response) {
        JsonObject json = com.google.gson.JsonParser.parseString(response.body()).getAsJsonObject();
        JsonObject recipe = json.getAsJsonArray("recipes").get(0).getAsJsonObject();
        this.id = recipe.get("id").getAsInt();
        this.title = recipe.get("title").getAsString();
        this.image = recipe.get("image").getAsString();
        this.fullRecipe = recipe;
    }

    @Override
    public String toString() {
        return fullRecipe.toString();
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getImage() {
        return image;
    }

    public JsonObject getFullRecipe() {
        return fullRecipe;
    }

    public JsonObject getJSON() {
        return fullRecipe;
    }
}
