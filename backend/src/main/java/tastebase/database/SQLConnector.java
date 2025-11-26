package tastebase.database;

import tastebase.Config;
import tastebase.obj.Recipe;

import java.sql.*;

public class SQLConnector {

    private static String url = Config.get("DB_URL");
    private static String user = Config.get("DB_USER");
    private static String password = Config.get("DB_PASSWORD");

    private static String overrideUrl = null;

    public static ResultSet executeQuery(String query) throws SQLException {
        try (Connection conn = (overrideUrl != null) ? DriverManager.getConnection(overrideUrl) : DriverManager.getConnection("jdbc:mariadb://"+url, user, password)) {
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            return rs;
        }
    }

    public static Connection getConnection() throws SQLException {
        if (overrideUrl != null) {
            return DriverManager.getConnection(overrideUrl);
        }

        return DriverManager.getConnection("jdbc:mariadb://"+url, user, password);
    }

    public static void useUrlForTests(String url) {
        overrideUrl = url;
    }
}
