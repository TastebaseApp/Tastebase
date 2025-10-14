package tastebase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import tastebase.api.PantryHandler;
import tastebase.api.SpoonacularService;
import tastebase.database.SQLConnector;
import tastebase.obj.Recipe;

import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

@SpringBootApplication
public class App {

    private static SpoonacularService spoonacularService;
    private static PantryHandler pantryHandler;

    public static void main(String[] args) throws Exception {
        System.out.println("Starting app.");

        System.out.println("Checking database connection...");
        try {
            SQLConnector.executeQuery("SELECT * FROM test");
        } catch (SQLException ex) {
            Logger.getLogger(App.class.getName()).log(Level.SEVERE, null, ex);
            throw new Exception("Failed to connect to database. Check your configuration.");
        }
        System.out.println("Database connection established.");

        System.out.println("Starting Spring API");
        SpringApplication.run(App.class, args);

        spoonacularService = new SpoonacularService();
        pantryHandler = new PantryHandler();
    }

    public static SpoonacularService getSpoonacularService() {
        return spoonacularService;
    }
    public static PantryHandler getPantryHandler() {
        return pantryHandler;
    }
}