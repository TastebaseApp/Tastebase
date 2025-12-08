# Test Plan for PantryService Methods

This document outlines the test plan for three methods in
`backend/src/main/java/tastebase/api/service/PantryService.java`:

* `addItem`
* `removeItem`
* `getItems`

The testing suite uses **JUnit 5** and an **H2 in-memory mock database**, configured through `SQLConnector.useUrlForTests(...)`, identical to the testing strategy used for `UserDAOTest`.

---

## 1. addItem

**Location:** `backend/src/main/java/tastebase/api/service/PantryService.java` lines 17–27

**Method Signature:**

```java
public boolean addItem(Pantry pantry, Ingredient ingredient)
```

### Input Parameters

* `pantry` (Pantry): The pantry object whose items are being modified.
* `ingredient` (Ingredient): The new ingredient to be added.

### Test Cases

---

### 1.1 Successful Add — Ingredient Not Already in Pantry

* **Input:**
  `pantry` with no items, `ingredient` with ID 100.

* **Setup:**

    * Use the H2 in-memory database.
    * The pantry starts empty (not persisted yet).
    * Call `addItem(pantry, ingredient)`.

* **Expected Behavior:**

    * `pantry.addIngredient(ingredient)` returns true.
    * `PantryService` calls `savePantry(pantry)` internally.
    * `PantryDAO.upsert(pantry)` writes the pantry to the DB.

* **Assertions:**

    * The method returns `true`.
    * `pantry.getItems()` contains exactly one element.
    * H2 database contains the new pantry row.
    * JSON field `Items` contains the ingredient ID.

---

### 1.2 Duplicate Add — Ingredient Already Exists

* **Input:**
  `pantry` with ingredient ID 100 already added, then passed again.

* **Setup:**

    * Manually call `pantry.addIngredient(...)` once before invoking the service.
    * Ensure DB is empty prior to the test.

* **Expected Behavior:**

    * `pantry.addIngredient(...)` returns false.
    * `PantryService` must **not** call `PantryDAO.upsert`.
    * No DB changes occur.

* **Assertions:**

    * `addItem(...)` returns `false`.
    * Pantry item count remains unchanged.
    * Database contains **no** pantry row.

---

## 2. removeItem

**Location:** `backend/src/main/java/tastebase/api/service/PantryService.java` lines 29–37

**Method Signature:**

```java
public boolean removeItem(Pantry pantry, int id)
```

### Input Parameters

* `pantry` (Pantry): Pantry to remove data from.
* `id` (int): The ID of the ingredient to remove.

### Test Cases

---

### 2.1 Successful Remove — Ingredient Exists

* **Input:**
  Pantry containing a single ingredient with ID 200.

* **Setup:**

    * Add ingredient to pantry.
    * Persist pantry into the H2 DB using `PantryDAO.upsert`.
    * Call `removeItem(...)`.

* **Expected Behavior:**

    * `pantry.removeIngredient(id)` returns true.
    * `savePantry(pantry)` is invoked.
    * `PantryDAO.upsert` updates JSON field to an empty list.

* **Assertions:**

    * Returned value is `true`.
    * Pantry now has zero items.
    * Database row still exists but with empty `Items` JSON.

---

### 2.2 Removal Fails — Ingredient Does Not Exist

* **Input:**
  Pantry contains ingredient ID 200, but we request removal of ID 999.

* **Setup:**

    * Populate pantry in-memory but do **not** persist to DB.
    * Call `removeItem(pantry, 999)`.

* **Expected Behavior:**

    * `pantry.removeIngredient(999)` returns false.
    * `savePantry` is **not** invoked.
    * No DB updates occur.

* **Assertions:**

    * Returned value is `false`.
    * Pantry still has one item.
    * Database remains empty.

---

## 3. getItems

**Location:** `backend/src/main/java/tastebase/api/service/PantryService.java` lines 46–49

**Method Signature:**

```java
public List<Ingredient> getItems(Pantry pantry)
```

### Input Parameters

* `pantry` (Pantry): The pantry whose items are being returned.

### Test Cases

---

### 3.1 Non-Empty Pantry — Returns List of Items

* **Input:**
  Pantry with 2 ingredients: Salt (ID 1) and Pepper (ID 2).

* **Setup:**

    * Create a pantry.
    * Add two ingredients.
    * Call `getItems`.

* **Expected Behavior:**

    * The same list instance from pantry is returned.
    * No interactions with DB.

* **Assertions:**

    * Returned list contains exactly 2 items.
    * IDs match 1 and 2.
    * `assertSame(pantry.getItems(), returnedList)`.

---

### 3.2 Empty Pantry — Returns Empty List

* **Input:**
  Newly constructed empty pantry.

* **Setup:**
  None.

* **Expected Behavior:**

    * Returns empty list.
    * No DB access.

* **Assertions:**

    * Result list is empty.
    * List is not null.

---

## General Test Considerations

### Mock Database Strategy

* Tests use an **H2 in-memory database** configured via:

  ```java
  SQLConnector.useUrlForTests("jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1");
  ```
* Schema defined in `@BeforeAll`:

  ```sql
  CREATE TABLE pantries (
      ID INT PRIMARY KEY,
      Name TEXT NOT NULL,
      Items TEXT
  );
  ```
* Each test resets the table with:

  ```java
  DELETE FROM pantries;
  ```

This ensures full test isolation.

### Serialization Behavior

* `PantryDAO.upsert` stores `Items` as a serialized JSON string.
* Tests verify:

    * JSON is persisted for successful add/remove operations.
    * No DB writes occur when service methods return false.

### Interaction Pattern

* `PantryService` delegates persistence exclusively to:

  ```java
  private void savePantry(Pantry pantry) {
      PantryDAO.upsert(pantry);
  }
  ```
* Tests assert for *presence* or *absence* of DB rows depending on method flow.

---

## Test Coverage Overview

The test suite fully covers:

* Ingredient addition logic.
* Duplicate prevention logic.
* Successful / unsuccessful removal conditions.
* Persistence correctness across all cases.
* Retrieval of pantry items.
* Isolation between in-memory and DB states.
Running `./gradlew test` (or IntelliJ test runner) will generate coverage reports under:

```
backend/build/reports/tests/test/index.html
```