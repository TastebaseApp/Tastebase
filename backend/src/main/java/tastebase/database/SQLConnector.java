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

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:mariadb://"+url, user, password);
    }
}
