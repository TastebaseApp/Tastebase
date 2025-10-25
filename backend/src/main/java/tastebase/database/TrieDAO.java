package tastebase.database;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import tastebase.obj.Item;
import tastebase.util.Trie;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class TrieDAO {

    public static Trie load() {
        Trie trie = new Trie();

        String query = "select * from ingredients";

        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                trie.insert(rs.getString(1));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return trie;
    }

    public static void insert(Item item) {
        String query = "INSERT INTO ingredients (ingredient_name) values (?)";

        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);

            ps.setString(1, item.getItemName());

            ps.execute();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static void insert(String ingredientName) {
        String query = "INSERT INTO ingredients (ingredient_name) values (?)";

        try (Connection conn = SQLConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(query);

            ps.setString(1, ingredientName);

            ps.execute();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
