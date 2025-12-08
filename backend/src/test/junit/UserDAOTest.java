import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tastebase.database.SQLConnector;
import tastebase.database.UserDAO;
import tastebase.obj.User;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

public class UserDAOTest {

    @BeforeAll
    static void setup() throws Exception {
        SQLConnector.useUrlForTests("jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1");

        try (Connection conn = SQLConnector.getConnection();
             Statement st = conn.createStatement()) {

            String usersCreate =
                    "CREATE TABLE users ("
                            + " ID INT PRIMARY KEY AUTO_INCREMENT,"
                            + " provider TEXT NOT NULL,"
                            + " provider_id TEXT NOT NULL,"
                            + " name TEXT NOT NULL,"
                            + " email TEXT NOT NULL,"
                            + " picture TEXT NOT NULL,"
                            + " UNIQUE(email)"
                            + ");";

            st.execute(usersCreate);

            String userFavoritesCreate =
                    "CREATE TABLE user_favorites ("
                            + " user_id INT NOT NULL,"
                            + " recipe_id INT NOT NULL,"
                            + " PRIMARY KEY (user_id, recipe_id),"
                            + " FOREIGN KEY (user_id) REFERENCES users(ID) ON DELETE CASCADE ON UPDATE RESTRICT"
                            + ");";

            st.execute(userFavoritesCreate);
        }
    }

    @BeforeEach
    void reset() throws SQLException {
        String sql = "DELETE FROM users;";
        Connection conn = SQLConnector.getConnection();
        Statement st = conn.createStatement();
        st.execute(sql);
    }

    // -------------------------------
    // 1. findByEmail tests
    // -------------------------------

    @Test
    void testFindByEmail_findFromDB() throws SQLException {
        String sql = "INSERT INTO users (provider, provider_id, name, email, avatar) "
                + "VALUES ('provider', 'providerID', 'name', 'email', '');";

        Connection conn = SQLConnector.getConnection();
        Statement st = conn.createStatement();
        st.execute(sql);

        assertNotNull(UserDAO.findByEmail("email") , "Expected a User object to be returned, but got null");
    }

    @Test
    void testFindByEmail_findFromCache() throws SQLException {
        String sql = "INSERT INTO users (provider, provider_id, name, email, avatar) "
                + "VALUES ('provider', 'providerID', 'name', 'email', '');";

        Connection conn = SQLConnector.getConnection();
        Statement st = conn.createStatement();
        st.execute(sql);

        assertNotNull(UserDAO.findByEmail("email") , "Expected a User object to be returned, but got null");
    }

    @Test
    void testFindByEmail_notFound() {
        assertNull(UserDAO.findByEmail("email") , "Expected null to be returned, but got a User");
    }

    // -------------------------------
    // 2. upsert tests
    // -------------------------------

    @Test
    void testUpsert_insertNewUser() throws SQLException {
        User testUser = new User();
        testUser.setProvider("provider");
        testUser.setProviderID("providerID");
        testUser.setName("name");
        testUser.setEmail("email");
        testUser.setAvatar(new byte[0]);

        User returnedUser = UserDAO.upsert(testUser);

        assertNotEquals(0, returnedUser.getID(), "User ID should be set after insert");

        try (Connection conn = SQLConnector.getConnection(); PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
            ps.setInt(1, returnedUser.getID());
            ResultSet rs = ps.executeQuery();
            assertTrue(rs.next(), "User should exist in the database");
            assertEquals("email", rs.getString("email"));
        }
    }

    @Test
    void testUpsert_updateExistingUser() throws SQLException {
        try (Connection conn = SQLConnector.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                     "INSERT INTO users (provider, provider_id, name, email, avatar) VALUES (?, ?, ?, ?, ?)",
                     Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, "provider");
            ps.setString(2, "providerID");
            ps.setString(3, "name");
            ps.setString(4, "email");
            ps.setBytes(5, new byte[0]);
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            rs.next();
        }

        User testUser = new User();
        testUser.setProvider("providerUpdated");
        testUser.setProviderID("providerIDUpdated");
        testUser.setName("nameUpdated");
        testUser.setEmail("email");

        User returnedUser = UserDAO.upsert(testUser);

        try (Connection conn = SQLConnector.getConnection(); PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE email = ?")) {
            ps.setString(1, "email");
            ResultSet rs = ps.executeQuery();
            assertTrue(rs.next());
            assertEquals("providerUpdated", rs.getString("provider"));
            assertEquals("providerIDUpdated", rs.getString("provider_id"));
            assertEquals("nameUpdated", rs.getString("name"));
            assertEquals(testUser, returnedUser);
        }
    }

    // -------------------------------
    // 3. mapRow tests
    // -------------------------------

    @Test
    void testMapRow_correctMapping() throws SQLException {
        User user = new User();
        user.setProvider("provider");
        user.setProviderID("providerID");
        user.setName("name");
        user.setEmail("email");
        user.setAvatar(new byte[0]);

        try (Connection conn = SQLConnector.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                     "INSERT INTO users (provider, provider_id, name, email, avatar) VALUES (?, ?, ?, ?, ?)",
                     Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, user.getProvider());
            ps.setString(2, user.getProviderID());
            ps.setString(3, user.getName());
            ps.setString(4, user.getEmail());
            ps.setBytes(5, user.getAvatar());
            ps.executeUpdate();

            ResultSet rs = ps.getGeneratedKeys();
            rs.next();
            user.setID(rs.getInt(1));
        }

        try (Connection conn = SQLConnector.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
            ps.setInt(1, user.getID());
            ResultSet rs = ps.executeQuery();
            rs.next();

            User mappedUser = UserDAO.mapRow(rs);

            assertEquals(user.getID(), mappedUser.getID());
            assertEquals(user.getProvider(), mappedUser.getProvider());
            assertEquals(user.getProviderID(), mappedUser.getProviderID());
            assertEquals(user.getEmail(), mappedUser.getEmail());
            assertEquals(user.getName(), mappedUser.getName());
            assertEquals(user.getAvatar(), mappedUser.getAvatar());
        }
    }

    @Test
    void testMapRow_missingField_throwsSQLException() throws SQLException {
        try (Connection conn = SQLConnector.getConnection();
             Statement st = conn.createStatement()) {
            st.execute("INSERT INTO users (ID, provider, provider_id, name, email, avatar) " +
                    "VALUES (1, 'provider', 'providerID', 'name', 'email', 'picture')");
        }

        try (Connection conn = SQLConnector.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT id, provider, provider_id, name, email FROM users")) { // picture column missing
            rs.next();
            assertThrows(SQLException.class, () -> UserDAO.mapRow(rs));
        }
    }
}
