# Test Plan for pantryService Methods

This document outlines the test plan for three methods in `frontend/services/pantryService.ts`:
- `listIngredients`
- `addIngredient`
- `removeIngredient`

**Note:** For all tests, the authentication token parameter can be set to `"TESTING"` and will be treated as a valid user token.

---

## 1. listIngredients

**Location:** `frontend/services/pantryService.ts` lines 26-59

**Method Signature:**
```typescript
async listIngredients(token: string | null): Promise<Ingredient[]>
```

### Input Parameters
- `token` (string | null): Authentication token required for API calls

### Test Cases

#### 1.1 Successful API Response - Populated Pantry
- **Input:** `token = "TESTING"`
- **Setup:** Pre-populate `pantry.pantryItems` using `addIngredient` with 2-3 test ingredients (or directly set `pantry.pantryItems`) to test the fallback behavior, then clear it before the API call to test the API response
- **Mock:** Mock a successful `fetch` response (status 200) with a valid JSON array of pantry items (e.g., 2-3 ingredients)
- **Expected Behavior:**
  - Makes GET request to `${API_BASE}/api/pantry/items` (line 31)
  - Sets `Authorization: Bearer TESTING` header (line 37)
  - Sets `Accept: application/json` header (line 38)
  - Calls `parsePantryIngredients(data)` to parse the response (line 47)
  - Updates `pantry.pantryItems` with the parsed ingredients from API (line 50)
  - Returns an array of `Ingredient` objects with deep-copied `amount` properties (line 52)
- **Assertions:**
  - Verify `fetch` was called with correct URL and headers
  - Verify the returned array matches the parsed ingredients from the API response
  - Verify `pantry.pantryItems` was updated with the API data (not the pre-populated data)
  - Verify returned array contains the expected number of ingredients
  - Verify each returned ingredient has a deep-copied `amount` object

#### 1.2 Null Token Error
- **Input:** `token = null`
- **Expected Behavior:**
  - Throws `Error` with message `'Authentication token required'` (line 28)
  - Does not make any API call
- **Assertions:**
  - Verify error is thrown with correct message
  - Verify `fetch` was not called

#### 1.3 API Error Response (Non-200 Status)
- **Input:** `token = "TESTING"`
- **Mock:** Mock a failed `fetch` response (e.g., status 500)
- **Expected Behavior:**
  - Makes GET request to the API endpoint
  - Throws `Error` with message `'Failed to fetch pantry items ({status})'` (line 43)
  - Falls back to local behavior: waits 150ms (line 56) and returns `pantry.pantryItems` with deep-copied `amount` properties (line 57)
- **Assertions:**
  - Verify error is thrown with correct status code in message
  - Verify fallback returns local pantry items
  - Verify returned items have deep-copied `amount` objects

#### 1.4 Network Error / JSON Parse Failure
- **Input:** `token = "TESTING"`
- **Mock:** Mock a network error or invalid JSON response
- **Expected Behavior:**
  - Catches the error in the catch block (line 53)
  - Falls back to local behavior: waits 150ms (line 56) and returns `pantry.pantryItems` with deep-copied `amount` properties (line 57)
- **Assertions:**
  - Verify fallback returns local pantry items
  - Verify returned items have deep-copied `amount` objects
  - Verify no error is thrown to the caller

#### 1.5 Empty Pantry Response
- **Input:** `token = "TESTING"`
- **Setup:** Ensure `pantry.pantryItems` is in a known state (either empty or populated) before the test
- **Mock:** Mock a successful response with an empty array `[]`
- **Expected Behavior:**
  - Successfully parses the empty array
  - Updates `pantry.pantryItems` to an empty array (replacing any previous state) (line 50)
  - Returns an empty array
- **Assertions:**
  - Verify returned array is empty
  - Verify `pantry.pantryItems` is empty (regardless of initial state)
  - Verify the API response (empty array) takes precedence over any local state

---

## 2. addIngredient

**Location:** `frontend/services/pantryService.ts` lines 73-133

**Method Signature:**
```typescript
async addIngredient(id: number, newQty: number, unit: string, name: string, token: string | null): Promise<Ingredient>
```

### Input Parameters
- `id` (number): The ingredient ID
- `newQty` (number): The quantity to add
- `unit` (string): Unit of measurement
- `name` (string): Name of the ingredient
- `token` (string | null): Authentication token required for API calls

### Test Cases

#### 2.1 Successful API Response - New Ingredient
- **Input:** `id = 123`, `newQty = 5`, `unit = "cups"`, `name = "Flour"`, `token = "TESTING"`
- **Mock:** Mock a successful `fetch` response (status 200) with valid ingredient JSON
- **Expected Behavior:**
  - Makes POST request to `${API_BASE}/api/pantry/${id}?=${newQty}` (line 78)
  - Sets `Authorization: Bearer TESTING` header (line 84)
  - Sets `Content-Type: application/json` header (line 85)
  - Parses response JSON and constructs `Ingredient` object with fallback logic (lines 96-104):
    - `itemID`: uses `data.itemID ?? data.id ?? id`
    - `itemName`: uses `data.ingredientName ?? data.itemName ?? name`
    - `amount.amount`: uses `data.amount?.amount ?? newQty`
    - `amount.unit`: uses `data.amount?.unit ?? unit`
    - `image`: uses `data.image`
  - Updates local `pantry.pantryItems`: adds new item if not found, updates if found (lines 107-112)
  - Returns ingredient with deep-copied `amount` (line 114)
- **Assertions:**
  - Verify `fetch` was called with correct URL, method, and headers
  - Verify returned `Ingredient` matches expected structure
  - Verify `pantry.pantryItems` contains the new ingredient
  - Verify returned ingredient has deep-copied `amount` object

#### 2.2 Successful API Response - Existing Ingredient Update
- **Input:** `id = 123` (existing in pantry), `newQty = 10`, `unit = "cups"`, `name = "Flour"`, `token = "TESTING"`
- **Setup:** Pre-populate `pantry.pantryItems` with an ingredient having `itemID = 123`
- **Mock:** Mock a successful API response
- **Expected Behavior:**
  - Updates the existing ingredient in `pantry.pantryItems` (line 109) instead of adding a new one
  - Returns the updated ingredient
- **Assertions:**
  - Verify existing ingredient is updated, not duplicated
  - Verify `pantry.pantryItems` length remains the same
  - Verify returned ingredient has updated values

#### 2.3 Null Token Error
- **Input:** `token = null` (other parameters can be any valid values)
- **Expected Behavior:**
  - Throws `Error` with message `'Authentication token required'` (line 75)
  - Does not make any API call
- **Assertions:**
  - Verify error is thrown with correct message
  - Verify `fetch` was not called

#### 2.4 API Error Response (Non-200 Status)
- **Input:** `id = 123`, `newQty = 5`, `unit = "cups"`, `name = "Flour"`, `token = "TESTING"`
- **Mock:** Mock a failed `fetch` response (e.g., status 400 or 500)
- **Expected Behavior:**
  - Makes POST request to the API endpoint
  - Reads response text (line 90)
  - Throws `Error` with message `'Remote add failed: {status} {statusText} - {text}'` (line 91)
  - Falls back to local behavior in catch block (lines 120-131):
    - If ingredient exists in local pantry, returns it with updated quantity (lines 120-123)
    - If ingredient doesn't exist, returns a new ingredient object with provided parameters (lines 126-131)
- **Assertions:**
  - Verify error is thrown with correct status and message
  - Verify fallback returns appropriate ingredient object
  - Verify fallback ingredient uses provided parameters

#### 2.5 Network Error / Request Failure
- **Input:** `id = 123`, `newQty = 5`, `unit = "cups"`, `name = "Flour"`, `token = "TESTING"`
- **Mock:** Mock a network error (e.g., fetch throws)
- **Expected Behavior:**
  - Catches the error in the catch block (line 115)
  - Falls back to local behavior (lines 120-131)
  - Returns ingredient based on local pantry state or provided parameters
- **Assertions:**
  - Verify fallback returns appropriate ingredient
  - Verify no error is thrown to the caller

#### 2.6 Response Data Fallback Logic
- **Input:** `id = 123`, `newQty = 5`, `unit = "cups"`, `name = "Flour"`, `token = "TESTING"`
- **Mock:** Mock a successful response with partial/missing data fields
- **Expected Behavior:**
  - Uses fallback logic for missing fields (lines 97-102):
    - Missing `itemID`/`id` → uses parameter `id`
    - Missing `ingredientName`/`itemName` → uses parameter `name`
    - Missing `amount.amount` → uses parameter `newQty`
    - Missing `amount.unit` → uses parameter `unit`
- **Assertions:**
  - Verify all fallback paths are exercised
  - Verify returned ingredient has correct values from fallbacks

---

## 3. removeIngredient

**Location:** `frontend/services/pantryService.ts` lines 215-249

**Method Signature:**
```typescript
async removeIngredient(itemID: number, token: string | null): Promise<void>
```

### Input Parameters
- `itemID` (number): The ID of the ingredient to remove
- `token` (string | null): Authentication token required for API calls

### Test Cases

#### 3.1 Successful API Response
- **Input:** `itemID = 123`, `token = "TESTING"`
- **Setup:** Pre-populate `pantry.pantryItems` with an ingredient having `itemID = 123`
- **Mock:** Mock a successful `fetch` response (status 200)
- **Expected Behavior:**
  - Makes DELETE request to `${API_BASE}/api/pantry/remove?id=${itemID}` (line 220)
  - Sets `Authorization: Bearer TESTING` header (line 226)
  - Sets `Accept: application/json` header (line 227)
  - On success, removes the ingredient from `pantry.pantryItems` (lines 239-242)
  - Returns `void` (resolves successfully)
- **Assertions:**
  - Verify `fetch` was called with correct URL, method, and headers
  - Verify ingredient with matching `itemID` is removed from `pantry.pantryItems`
  - Verify `pantry.pantryItems` length decreases by 1
  - Verify promise resolves without error

#### 3.2 Null Token Error
- **Input:** `itemID = 123`, `token = null`
- **Expected Behavior:**
  - Throws `Error` with message `'Authentication token required'` (line 217)
  - Does not make any API call
- **Assertions:**
  - Verify error is thrown with correct message
  - Verify `fetch` was not called
  - Verify `pantry.pantryItems` is not modified

#### 3.3 API Error Response - 404 Not Found
- **Input:** `itemID = 123`, `token = "TESTING"`
- **Mock:** Mock a failed `fetch` response with status 404
- **Expected Behavior:**
  - Makes DELETE request to the API endpoint
  - Throws `Error` with message `'Item not found'` (line 233)
  - Does not modify `pantry.pantryItems` (error is thrown before removal logic)
- **Assertions:**
  - Verify error is thrown with message `'Item not found'`
  - Verify `pantry.pantryItems` is not modified

#### 3.4 API Error Response - Other Error Status
- **Input:** `itemID = 123`, `token = "TESTING"`
- **Mock:** Mock a failed `fetch` response with status 500 (or other non-404 error)
- **Expected Behavior:**
  - Makes DELETE request to the API endpoint
  - Throws `Error` with message `'Failed to remove pantry item ({status})'` (line 235)
  - Does not modify `pantry.pantryItems` (error is thrown before removal logic)
- **Assertions:**
  - Verify error is thrown with correct status code in message
  - Verify `pantry.pantryItems` is not modified

#### 3.5 Network Error / Request Failure
- **Input:** `itemID = 123`, `token = "TESTING"`
- **Setup:** Pre-populate `pantry.pantryItems` with an ingredient having `itemID = 123`
- **Mock:** Mock a network error (e.g., fetch throws)
- **Expected Behavior:**
  - Catches the error in the catch block (line 243)
  - Does not throw error to caller (line 248 comment indicates optimistic update behavior)
  - Note: The catch block doesn't explicitly remove from local pantry, but the comment suggests optimistic updates may have already occurred
- **Assertions:**
  - Verify no error is thrown to the caller
  - Verify behavior matches the optimistic update pattern described in comments

#### 3.6 Remove Non-Existent Item (Local)
- **Input:** `itemID = 999` (not in local pantry), `token = "TESTING"`
- **Mock:** Mock a successful API response (status 200)
- **Expected Behavior:**
  - Makes DELETE request to the API endpoint
  - Attempts to find and remove item from `pantry.pantryItems` (line 239)
  - Since item doesn't exist locally (`index === -1`), no local modification occurs
  - Returns `void` (resolves successfully)
- **Assertions:**
  - Verify API call is made successfully
  - Verify `pantry.pantryItems` is not modified (item wasn't in local list)
  - Verify promise resolves without error

#### 3.7 Remove Item That Exists Locally But Not on Server
- **Input:** `itemID = 123`, `token = "TESTING"`
- **Setup:** Pre-populate `pantry.pantryItems` with an ingredient having `itemID = 123`
- **Mock:** Mock a successful API response (status 200) - server accepts deletion
- **Expected Behavior:**
  - Makes DELETE request to the API endpoint
  - Removes item from `pantry.pantryItems` on successful response (lines 239-242)
  - Returns `void` (resolves successfully)
- **Assertions:**
  - Verify item is removed from local pantry
  - Verify promise resolves successfully

---

## General Test Considerations

### Mocking Strategy
- Mock the global `fetch` function for all API calls
- Mock `parsePantryIngredients` function if needed (or test with real implementation)
- Use `"TESTING"` as the token value for all valid token scenarios
- For each test, set up the mock to return the desired response (success, error, etc.)
- Reset mocks between tests to avoid test interference

### State Management
- The `pantry` object (lines 6-9) maintains local state that persists across method calls
- **Important**: Reset `pantry.pantryItems` to `[]` before each test (or use `beforeEach`/`afterEach` hooks) to ensure test isolation
- For tests that need populated data, you can either:
  - Directly set `pantry.pantryItems = [...]` with test data
  - Use `addIngredient` to populate (but remember to reset state after)
- Consider the interaction between methods (e.g., `addIngredient` followed by `listIngredients`) - this is useful for testing the full workflow
- When testing `listIngredients` with populated pantry, ensure the API mock response is what gets returned (not the pre-populated local state), since the API response overwrites local state (line 50)

### Error Handling Patterns
- All three methods have try-catch blocks with fallback behavior
- `listIngredients` and `addIngredient` return fallback data instead of throwing in catch blocks
- `removeIngredient` catches errors but doesn't throw (optimistic update pattern)
- Test both API success and failure scenarios

### Deep Copying
- `listIngredients` and `addIngredient` return ingredients with deep-copied `amount` objects (lines 52, 114)
- Verify that modifications to returned objects don't affect the internal `pantry.pantryItems` state

### Test Results
- Whenever tests are run (`npm test`), a simple HTML report with pass/fail status and execution times will b generated in `frontend/test/results`
- When running tests with coverage (`jest --coverage`), a comprehensive HTML coverage report will be generated in `frontend/tests/results/coverage`
