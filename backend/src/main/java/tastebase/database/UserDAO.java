package tastebase.database;

import tastebase.obj.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

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

    public static User create(User user) {
        String query = "insert into users (provider, provider_id, name, email) values (?, ?, ?, ?, ?)";
        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, user.getProvider());
            ps.setString(2, user.getProviderID());
            ps.setString(3, user.getName());
            ps.setString(4, user.getEmail());
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

    private static User mapRow(ResultSet rs) throws SQLException {
        User user = new User();
        user.setID(rs.getInt("id"));
        user.setProvider(rs.getString("provider"));
        user.setProviderID(rs.getString("provider_id"));
        user.setEmail(rs.getString("email"));
        user.setName(rs.getString("name"));
        return user;
    }

}
