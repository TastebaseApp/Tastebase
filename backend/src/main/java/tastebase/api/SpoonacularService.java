package tastebase.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import tastebase.Config;
import tastebase.obj.Recipe;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.stream.Collectors;

public class SpoonacularService {

    String apiKey;
    String baseUrl;

    public SpoonacularService() {
        apiKey = Config.get("SPN_KEY");
        baseUrl = "https://api.spoonacular.com/";
    }

    //TODO: fix
    public Recipe getRecipe(int id) {
        String url = baseUrl + "recipes/" + id + "/information?includeNutrition=false?apiKey=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.body() != null) {
                return new Recipe(response);
            } else {
                System.out.println("Error: Empty response from Spoonacular API");
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Comma separated list of ingredients (ie "apples,flour,sugar")
    // Does not return full recipes (just id, title, image, etc)
    // Use getRecipe(id) to get full recipe information
    public List<JsonElement> getRecipes(String ingredients) {
        String url = baseUrl + "recipes/findByIngredients?ingredients=" + ingredients.replaceAll(",", ",+") + "&apiKey=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.body() != null) {
                JsonArray recipes = JsonParser.parseString(response.body()).getAsJsonArray();
                return recipes.asList();
            } else {
                System.out.println("Error: Empty response from Spoonacular API");
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Recipe getRandomRecipe() {
        String url = baseUrl + "recipes/random?apiKey=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.body() != null) {
                return new Recipe(response);
            } else {
                System.out.println("Error: Empty response from Spoonacular API");
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
