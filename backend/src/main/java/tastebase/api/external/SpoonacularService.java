package tastebase.api.external;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import tastebase.Config;
import tastebase.obj.Recipe;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SpoonacularService {

    String apiKey;
    String baseUrl;

    public SpoonacularService() {
        apiKey = Config.get("SPN_KEY");
        baseUrl = "https://api.spoonacular.com/";
    }

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

    public List<Recipe> getRandomRecipes(int number) {
        String url = baseUrl + "recipes/random?number=" + number + "&apiKey=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.body() == null || response.body().isBlank()) {
                System.out.println("Error: Empty response from Spoonacular API");
                return Collections.emptyList();
            }

            JsonObject json = JsonParser.parseString(response.body()).getAsJsonObject();
            JsonArray arr = json.getAsJsonArray("recipes");

            List<Recipe> results = new ArrayList<>();

            for (JsonElement element : arr) {
                JsonObject recipeObj = element.getAsJsonObject();
                results.add(new Recipe(recipeObj));
            }

            return results;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<JsonElement> searchIngredients(String query, int number) {
        String url = baseUrl + "food/ingredients/autocomplete?query=" + query + "&number=" + number + "&metaInformation=true&apiKey=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.body() != null) {
                JsonArray ingredients = JsonParser.parseString(response.body()).getAsJsonArray();
                return ingredients.asList();
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
