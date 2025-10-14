package tastebase.database;

import tastebase.Config;
import tastebase.obj.Recipe;

import java.sql.*;

public class SQLConnector {

    private static String url = Config.get("DB_URL");
    private static String user = Config.get("DB_USER");
    private static String password = Config.get("DB_PASSWORD");

    public static ResultSet executeQuery(String query) throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:mariadb://"+url, user, password)) {
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            return rs;
        }
    }

    public static Recipe getRecipe(int id) {
        String statement = "SELECT * FROM recipes WHERE ID = " + id;
        try {
            ResultSet rs = executeQuery(statement);
            if (rs.next()) {
                String fullRecipe = rs.getString("FullRecipe");
                return new Recipe(com.google.gson.JsonParser.parseString(fullRecipe).getAsJsonObject());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void saveRecipe(Recipe recipe) {
        String statement = "INSERT INTO recipes (ID, Title, FullRecipe) VALUES (?, ?, ?)";
        try (PreparedStatement ps = DriverManager.getConnection("jdbc:mariadb://"+url, user, password).prepareStatement(statement)) {
            ps.setInt(1, recipe.getId());
            ps.setString(2, recipe.getTitle());
            ps.setString(3, recipe.getFullRecipe().toString());
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static boolean hasRecipe(int id) {
        String statement = "SELECT * FROM recipes WHERE ID = " + id;

        try {
            ResultSet rs = executeQuery(statement);
            if (rs.next()) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
