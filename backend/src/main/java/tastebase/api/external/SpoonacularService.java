package tastebase.api.external;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;
import tastebase.Config;
import tastebase.obj.Recipe;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class SpoonacularService {

    String apiKey;
    String baseUrl;

    public SpoonacularService() {
        apiKey = Config.get("SPN_KEY");
        baseUrl = "https://api.spoonacular.com/";
    }

    public Recipe getRecipe(int id) {
        Map<String, String> params = new HashMap();
        params.put("includeNutrition", "false");
        String url = buildUrl("recipes/" + id + "/information", params);

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
    public List<JsonElement> getRecipes(String query, String ingredients, Cuisine cuisine, NutrientFilter nutrientFilter, int number) {
        Map<String, String> params = new HashMap();
        params.put("query", (query != null)  ? query : "");
        if (ingredients != null && !ingredients.isEmpty()) params.put("includeIngredients", ingredients);
        if (cuisine != null) params.put("cuisine", cuisine.toString().replace("_", " "));
        if (number == 0) params.put("number", "10");
        params.put("sort", "min-missing-ingredients");

        if (nutrientFilter != null) {
            params.putAll(nutrientFilter.toQueryParams());
        }

        String url = buildUrl("recipes/complexSearch", params);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.body() != null) {
                JsonArray recipes = JsonParser.parseString(response.body()).getAsJsonObject().get("results").getAsJsonArray();
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
        Map<String, String> params = new HashMap();
        params.put("number", String.valueOf(number));
        String url = buildUrl("recipes/random", params);

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
        Map<String, String> params = new HashMap();
        params.put("query", query);
        params.put("number", String.valueOf(number));
        params.put("metaInformation", "true");
        String url = buildUrl("food/ingredients/autocomplete", params);

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

    private String buildUrl(String path, Map<String, String> params) {
        StringBuilder sb = new StringBuilder(baseUrl);
        if (!path.startsWith("/")) sb.append('/');
        sb.append(path);
        params = (params == null) ? Collections.emptyMap() : params;

        // always include apiKey
        Map<String, String> full = new LinkedHashMap<>(params);
        full.put("apiKey", apiKey);

        boolean first = true;
        for (Map.Entry<String, String> e : full.entrySet()) {
            sb.append(first ? '?' : '&');
            first = false;
            sb.append(encode(e.getKey()));
            sb.append('=');
            sb.append(encode(e.getValue()));
        }
        return sb.toString();
    }

    private String encode(String s) {
        return URLEncoder.encode(s == null ? "" : s, StandardCharsets.UTF_8);
    }
}
