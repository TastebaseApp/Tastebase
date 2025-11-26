# Test Plan for UserDAO Methods

This document outlines the test plan for three methods in `backend/src/main/java/database/UserDAO.java`:
- `findByEmail`
- `upsert`
- `mapRow`

---

## 1. findByEmail

**Location:** `backend/src/main/java/database/UserDAO.java` lines 17-34

**Method Signature:**
```java
public static User findByEmail(String email) {}
```

### Input Parameters
- `email` (string): The email used to search the database.

### Test Cases

#### 1.1 Successful Search - User exists by that email in the database, but not the cache
- **Input:** `email`
- **Setup:** Create a mock database using H2 and populate it with a user by the email `email`
- **Mock:** Mock a successful SQL search `select * from users where email = ?`
- **Expected Behavior:**
    - Find the cache does not have the email stored (line 18)
    - Create a connection to the database (line 20)
    - Prepare the query with the input `email` (line 22)
    - Execute the query (line 23)
    - Get a result (line 25)
    - Cache the user (line 26)
    - Return the user (line 27)
- **Assertions:**
    - Verify the correct user is returned

#### 1.2 Successful Search - User exists by that email in the cache
- **Input:** `email`
- **Setup:** Create a mock user with the email `email` and add them to the `userCache`
- **Mock:** Mock a successful cache hit for the user with email `email`
- **Expected Behavior:**
    - Find the cache has the email stored (line 18)
    - Return the user from the cache (line 18)
- **Assertions:**
    - Verify the correct user is returned

#### 1.3 Unsuccessful Search - User does not exist by that email in the cache or database
- **Input:** `email`
- **Setup:** Create a mock database using H2 and do not populate it with anything
- **Mock:** Mock an unsuccessful search for a user with email `email`
- **Expected Behavior:**
    - Find the cache does not have the email stored (line 18)
    - Create a connection to the database (line 20)
    - Prepare the query with the input `email` (line 22)
    - Execute the query (line 23)
    - Get no results (line 25)
    - Return `null` (line 33)
- **Assertions:**
    - Verify the cache does have the user
    - Verify the database does not have the user
    - Verify the connection was made properly
    - Verify `null` is returned

## 2. upsert

**Location:** `backend/src/main/java/database/UserDAO.java` lines 54-83

**Method Signature:**
```java
public static User upsert(User user) {}
```

### Input Parameters
- `user` (User): The user to be inserted or updated in the database.

### Test Cases

#### 2.1 Successful insertion - User does not already exist in the database
- **Input:** `user`
- **Setup:** Create a mock database using H2
- **Mock:** Mock a successful SQL insertion
- **Expected Behavior:**
  - Create a connection to the database (line 63)
  - Prepare the statement with the `user` information (lines 64-70)
  - Execute the insertion (line 72)
  - Find the `user` had a key generated (line 75)
  - Set the `user`'s id to the generated id (line 76)
  - Return the updated `user` line 79
- **Assertions:**
  - Verify the database does not already have the `user`
  - Verify the connection was made properly
  - Verify the database has the `user` afterwords
  - Verify the `user` has the `id` field set after insertion

#### 2.2 Successful update - User does already exist in the database
- **Input:** `user`
- **Setup:** Create a mock database using H2 and populate it with the `user` 
- **Mock:** Mock a successful SQL update
- **Expected Behavior:**
  - Create a connection to the database (line 63)
  - Prepare the statement with the `user` information (lines 64-70)
  - Execute the update (line 72)
  - Find the `user` had no key generated (line 75)
  - Return the same `user` line 79
- **Assertions:**
  - Verify the database does already have the `user`
  - Verify the connection was made properly
  - Verify the database has the updated `user` afterwords
  - Verify the returned `User` matches the original `user`

## 3. mapRow

**Location:** `backend/src/main/java/database/UserDAO.java` lines 109-120

**Method Signature:**
```java
public static User mapRow(ResultSet rs) {}
```

### Input Parameters
- `rs` (ResultSet): The result from a SQL query to be mapped to a `User`

### Test Cases

#### 3.1 Correct Mapping
- **Input:** `rs`
- **Setup:** Create a mock `User` and a mock database using H2 and populate the database with the `User`, then search for the `User` to generate a `ResultSet`
- **Mock:** Mock a successful mapping where the pre-generated `User` matches the output
- **Expected Behavior:**
  - Create a new `User` (line 110)
  - Populate the `User` with the `ResultSet` information (lines 111-118)
  - Return the `User` (line 119)
- **Assertions:**
  - Verify the returned `User` matches the pre-generated `User`

#### 3.2 Missing Information
- **Input:** `rs`
- **Setup:** Create a mock `User` and a mock database using H2 and populate the database with the `User`, then search for the `User` to generate a `ResultSet`, but remove a field from the `ResultSet`
- **Mock:** Mock the missing information in the `ResultSet` 
- **Expected Behavior:**
  - Create a new `User` (line 110)
  - Fail to populate the `User` with the `ResultSet` information (lines 111-118)
  - Throw a new `SQLException`
- **Assertions:**
  - Verify a `SQLException` is thrown

---

## General Test Considerations

### Mocking Strategy
- Mock the database using H2 to create a temporary in-memory database to use
- Mock `SQLConnector` to return said mock database
- For each test, set up the mock to have the desired information
- Reset mocks between tests to avoid test interference

### State Management
- The `userCache` object (line 15) maintains local state that persists across method calls
- **Important**: Reset `userCache` to `new HashMap<>()` before each test to ensure test isolation


### Error Handling Patterns
- All methods dealing with the database have try-catch blocks with fallback behavior
- `findByEmail` throws a `RuntimeException` when the database connection cannot be found killing the process to ensure we don't try to run the backend when the database is failing
- Test both success and failure scenarios

### Test Results
- When running tests with coverage (`./gradlew test`), HTML coverage reports will be generated in `backend/build/reports/tests/test/index.html`
