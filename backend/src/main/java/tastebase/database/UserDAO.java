package tastebase.database;

import tastebase.obj.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

public class UserDAO {

    public static User findByEmail(String email) {
        String query = "select * from users where email = ?";
        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return null;
    }

    public static User findByID(int id) {
        String query = "select * from users where id = ?";

        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return null;
    }

    public static User upsert(User user) {
        String query =
                "INSERT INTO users (provider, provider_id, name, email, avatar) " +
                        "VALUES (?, ?, ?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE " +
                        "provider = VALUES(provider), " +
                        "provider_id = VALUES(provider_id), " +
                        "avatar = VALUES(avatar), " +
                        "name = VALUES(name)";

        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS);

            ps.setString(1, user.getProvider());
            ps.setString(2, user.getProviderID());
            ps.setString(3, user.getName());
            ps.setString(4, user.getEmail());
            ps.setBytes(5, user.getAvatar());

            ps.executeUpdate();

            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                user.setID(rs.getInt(1));
            }

            return user;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static void deleteFavorite(User user, int recipeID) {
        String query = "DELETE FROM user_favorites WHERE user_id = ? AND recipe_id = ?";
        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, user.getID());
            ps.setInt(2, recipeID);
            ps.execute();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static void saveFavorite(User user, int recipeID) {
        String query = "INSERT IGNORE INTO user_favorites (user_id, recipe_id) VALUES (?, ?)";
        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, user.getID());
            ps.setInt(2, recipeID);
            ps.execute();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static User mapRow(ResultSet rs) throws SQLException {
        User user = new User();
        user.setID(rs.getInt("id"));
        user.setProvider(rs.getString("provider"));
        user.setProviderID(rs.getString("provider_id"));
        user.setEmail(rs.getString("email"));
        user.setName(rs.getString("name"));
        user.setAvatar(rs.getBytes("avatar"));

        user.setFavorites(loadFavorites(user.getID()));
        return user;
    }

    private static Set<Integer> loadFavorites(int userID) {
        String query = "SELECT recipe_id FROM user_favorites WHERE user_id = ?";
        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, userID);
            ResultSet rs = ps.executeQuery();
            HashSet<Integer> favorites = new HashSet<>();
            while (rs.next()) {
                favorites.add(rs.getInt("recipe_id"));
            }
            return favorites;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
