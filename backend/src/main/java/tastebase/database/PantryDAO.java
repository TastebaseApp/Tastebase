package tastebase.database;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tastebase.obj.Ingredient;
import tastebase.obj.Pantry;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class PantryDAO {

    private static final ObjectMapper mapper = new ObjectMapper();


    public static boolean exists(int pantryId) {
        String statement = "SELECT * FROM pantries WHERE ID = ? LIMIT 1";
        try (var conn = SQLConnector.getConnection(); var ps = conn.prepareStatement(statement)) {
            ps.setInt(1, pantryId);
            try (var rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            throw new  RuntimeException(e);
        }
    }

    public static Pantry getPantry(int pantryId) {
        String statement = "SELECT * FROM pantries WHERE ID = ? LIMIT 1";
        try (var conn = SQLConnector.getConnection(); var ps = conn.prepareStatement(statement)) {
            ps.setInt(1, pantryId);
            try (var rs = ps.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }
    public static void upsert(Pantry pantry) {
        String statement = "INSERT INTO pantries (ID, Name, Items) " +
                "VALUES (?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE " +
                "Name = VALUES(Name), " +
                "Items = VALUES(Items)";

        try (Connection conn = SQLConnector.getConnection();
             PreparedStatement ps = conn.prepareStatement(statement)) {

            ps.setInt(1, pantry.getPantryID());
            ps.setString(2, pantry.getPantryName());
            ps.setString(3, mapper.writeValueAsString(pantry.getItems()));

            ps.executeUpdate();

        } catch (Exception e) {
            throw new  RuntimeException(e);
        }
    }

    private static Pantry mapRow(ResultSet rs) throws SQLException {
        Pantry pantry = new Pantry(rs.getInt("ID"), rs.getString("Name"));

        String json = rs.getString("Items");
        List<Ingredient> ingredients = List.of();

        if (!(json == null) && !json.isBlank()) {
            Gson gson = new Gson();
            var type = new TypeToken<List<Ingredient>>() {}.getType();
            ingredients = gson.fromJson(json, type);
        }

        pantry.setItems(ingredients);

        return pantry;
    }
}
