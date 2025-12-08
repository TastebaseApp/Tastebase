import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tastebase.api.service.PantryService;
import tastebase.database.PantryDAO;
import tastebase.database.SQLConnector;
import tastebase.obj.Ingredient;
import tastebase.obj.Pantry;

import java.sql.Connection;
import java.sql.Statement;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class PantryServiceTest {

    private static PantryService pantryService;

    @BeforeAll
    static void setup() throws Exception {
        SQLConnector.useUrlForTests("jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1");

        try (Connection conn = SQLConnector.getConnection();
             Statement st = conn.createStatement()) {
             String pantriesCreate =
                    "CREATE TABLE IF NOT EXISTS pantries ("
                            + " ID INT PRIMARY KEY,"
                            + " Name TEXT NOT NULL,"
                            + " Items TEXT"
                            + ");";

            st.execute(pantriesCreate);
        }

        pantryService = new PantryService();
    }

    @BeforeEach
    void reset() throws Exception {
        // Clean table between tests for isolation
        try (Connection conn = SQLConnector.getConnection();
             Statement st = conn.createStatement()) {
            st.execute("DELETE FROM pantries;");
        }
    }

    // Helper to create a simple Ingredient with a known ID
    private Ingredient createIngredient(int id, String name) {
        Ingredient ingredient = new Ingredient();
        ingredient.setIngredientId(id);   // adjust if your setter is named differently
        ingredient.setIngredientName(name);         // optional, adjust to your real API
        return ingredient;
    }

    // --------------------------------------------------------------------
    // 1. addItem tests
    // --------------------------------------------------------------------

    @Test
    void addItem_success_newIngredient_addedAndPersisted() {
        Pantry pantry = new Pantry(1, "My Pantry");
        Ingredient ingredient = createIngredient(100, "Tomato");

        boolean result = pantryService.addItem(pantry, ingredient);

        // In-memory assertions
        assertTrue(result, "addItem should return true when ingredient is newly added");
        assertEquals(1, pantry.getItemCount(), "Pantry should contain exactly one item after add");
        assertEquals(100, pantry.getItems().get(0).getIngredientId());

        // DB assertions (PantryDAO.upsert should have been called)
        Pantry fromDb = PantryDAO.getPantry(1);
        assertNotNull(fromDb, "Pantry should have been persisted in the database");
        assertEquals("My Pantry", fromDb.getPantryName(), "Pantry name should be persisted correctly");
        assertEquals(1, fromDb.getItemCount(), "Persisted pantry should contain the same number of items");
        assertEquals(100, fromDb.getItems().get(0).getIngredientId(), "Persisted ingredient ID should match");
    }

    @Test
    void addItem_duplicateIngredient_returnsFalse_andDoesNotPersist() {
        Pantry pantry = new Pantry(1, "My Pantry");
        Ingredient ingredient = createIngredient(100, "Tomato");

        // Pre-add directly so addIngredient will later return false
        assertTrue(pantry.addIngredient(ingredient), "Initial addIngredient should succeed");

        // DB is still empty at this point
        assertNull(PantryDAO.getPantry(1), "Pantry should not be in DB before calling service.addItem");

        boolean result = pantryService.addItem(pantry, ingredient);

        // In-memory assertions
        assertFalse(result, "addItem should return false for a duplicate ingredient");
        assertEquals(1, pantry.getItemCount(), "Pantry item count should not change on duplicate add");

        // DB assertions: upsert should not have been invoked
        Pantry fromDb = PantryDAO.getPantry(1);
        assertNull(fromDb, "Pantry should not be persisted when addIngredient returns false");
    }

    // --------------------------------------------------------------------
    // 2. removeItem tests
    // --------------------------------------------------------------------

    @Test
    void removeItem_success_existingIngredient_removedAndPersisted() {
        Pantry pantry = new Pantry(1, "My Pantry");
        Ingredient ingredient = createIngredient(200, "Onion");

        // Start with one item both in memory and in DB
        assertTrue(pantry.addIngredient(ingredient));
        PantryDAO.upsert(pantry);

        Pantry fromDbBefore = PantryDAO.getPantry(1);
        assertNotNull(fromDbBefore, "Pantry should exist in DB before removal");
        assertEquals(1, fromDbBefore.getItemCount(), "DB pantry should start with one item");

        boolean result = pantryService.removeItem(pantry, ingredient.getIngredientId());

        // In-memory assertions
        assertTrue(result, "removeItem should return true when ingredient is found");
        assertEquals(0, pantry.getItemCount(), "Pantry should be empty after removing the only item");

        // DB assertions: pantry should be updated with empty items list
        Pantry fromDbAfter = PantryDAO.getPantry(1);
        assertNotNull(fromDbAfter, "Pantry should still exist in DB after removal");
        assertEquals(0, fromDbAfter.getItemCount(), "Persisted pantry should reflect removal of ingredient");
    }

    @Test
    void removeItem_notFound_returnsFalse_andDoesNotPersist() {
        Pantry pantry = new Pantry(1, "My Pantry");
        Ingredient ingredient = createIngredient(200, "Onion");

        // One item in memory, but we never persist this pantry
        assertTrue(pantry.addIngredient(ingredient));
        assertNull(PantryDAO.getPantry(1), "Pantry should not exist in DB yet");

        boolean result = pantryService.removeItem(pantry, 999); // ID that does not exist

        // In-memory
        assertFalse(result, "removeItem should return false when item ID is not found");
        assertEquals(1, pantry.getItemCount(), "Pantry should remain unchanged when removal fails");

        // DB remains untouched
        Pantry fromDb = PantryDAO.getPantry(1);
        assertNull(fromDb, "Pantry should not be persisted when removal fails");
    }

    // --------------------------------------------------------------------
    // 3. getItems tests
    // --------------------------------------------------------------------

    @Test
    void getItems_nonEmptyPantry_returnsSameList() {
        Pantry pantry = new Pantry(1, "My Pantry");
        Ingredient i1 = createIngredient(1, "Salt");
        Ingredient i2 = createIngredient(2, "Pepper");

        assertTrue(pantry.addIngredient(i1));
        assertTrue(pantry.addIngredient(i2));

        List<Ingredient> items = pantryService.getItems(pantry);

        assertNotNull(items, "getItems should not return null");
        assertEquals(2, items.size(), "getItems should return all items in the pantry");
        assertEquals(1, items.get(0).getIngredientId());
        assertEquals(2, items.get(1).getIngredientId());

        // Optional: ensure it's the same underlying list, not a copy
        assertSame(pantry.getItems(), items, "getItems should return the pantry's internal list");
    }

    @Test
    void getItems_emptyPantry_returnsEmptyList() {
        Pantry pantry = new Pantry(1, "Empty Pantry");

        List<Ingredient> items = pantryService.getItems(pantry);

        assertNotNull(items, "getItems should never return null");
        assertTrue(items.isEmpty(), "Empty pantry should yield an empty list");
    }
}