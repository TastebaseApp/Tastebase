# Test Plan for `pantry.ts` Types

This document outlines the test plan for these types within `@/types/pantry`:

- `Quantity`
- `Ingredient`
- `Pantry`
- `Recipe`

Because these are types (and not classes or functions with behavior), and since Jest can't test types directly, runtime helper functions are declared in a separate file (`@/tests/pantryTypeHelper.ts`) for Jest to exercise.

This document covers the helper functions that will be tested.

---

## 1. `createQuantity`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function createQuantity(amount: number, unit: string): Quantity
```

### Input Parameters

- `amount` (number): numeric quantity.
- `unit` (string): unit label (e.g. `"g"`, `"ml"`, `"pcs"`).

### Test Cases

#### 1.1 Creates a Quantity with correct fields
- **Input:** `createQuantity(2.5, "cups")`
- **Expected:** returns `{ amount: 2.5, unit: "cups" }`.

#### 1.2 Handles zero and negative amounts
- **Input:** `createQuantity(0, "g")`
  - Expected: `{ amount: 0, unit: "g" }`.
- **Input:** `createQuantity(-5, "g")`
  - Expected: `{ amount: -5, unit: "g" }` (no validation in helper).

#### 1.3 Preserves arbitrary unit strings
- **Input:** `createQuantity(1, "weird-unit")`
- **Expected:** `unit` is exactly `"weird-unit"`.

---

## 2. `createIngredient`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function createIngredient(
  itemID: number,
  itemName: string,
  amount: Quantity,
  overrides: Partial<Omit<Ingredient, "itemID" | "itemName" | "amount">> = {}
): Ingredient
```

### Input Parameters

- `itemID` (number): ingredient ID.
- `itemName` (string): ingredient name.
- `amount` (`Quantity`): amount and unit.
- `overrides` (optional): extra fields like `image`, `possibleUnits`.

### Test Cases

#### 2.1 Creates an Ingredient with required fields
- **Input:** `createIngredient(1, "Flour", { amount: 500, unit: "g" })`
- **Expected:**
  - `itemID === 1`
  - `itemName === "Flour"`
  - `amount === { amount: 500, unit: "g" }`
  - Optional fields are `undefined`.

#### 2.2 Applies overrides to optional fields
- **Input:**  
  `createIngredient(2, "Milk", { amount: 1, unit: "l" }, { image: "milk.png", possibleUnits: ["ml", "l"] })`
- **Expected:** returned object has:
  - `image === "milk.png"`
  - `possibleUnits` includes `"ml"` and `"l"`.

#### 2.3 Required fields come from parameters, not overrides
- **Setup:** attempt to pass `itemID` or `itemName` in `overrides` using `as any`.
- **Expected:** resulting `Ingredient` still uses the explicit `itemID`, `itemName`, and `amount` arguments (spread order ensures this).

---

## 3. `createPantry`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function createPantry(pantryID: number, pantryName: string): Pantry
```

### Input Parameters

- `pantryID` (number): pantry ID.
- `pantryName` (string): pantry display name.

### Test Cases

#### 3.1 Creates pantry with empty `pantryItems`
- **Input:** `createPantry(1, "Main Pantry")`
- **Expected:**
  - `pantryID === 1`
  - `pantryName === "Main Pantry"`
  - `pantryItems` is an empty array (`[]`).

---

## 4. `createRecipe`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function createRecipe(
  id: number,
  title: string,
  overrides: Partial<Omit<Recipe, "id" | "title">> = {}
): Recipe
```

### Input Parameters

- `id` (number): recipe ID.
- `title` (string): recipe title.
- `overrides` (optional): any other `Recipe` fields (e.g. `servings`, `ingredients`, `dishTypes`, `winePairing`).

### Test Cases

#### 4.1 Creates minimal recipe
- **Input:** `createRecipe(1, "Pasta")`
- **Expected:**  
  - `id === 1`  
  - `title === "Pasta"`  
  - Other fields are `undefined`.

#### 4.2 Applies overrides
- **Input:**  
  `createRecipe(2, "Soup", { servings: 4, readyInMinutes: 30, dishTypes: ["dinner"] })`
- **Expected:** returned recipe has those override values set.

#### 4.3 Allows `winePairing` to be null
- **Input:** `createRecipe(3, "Stew", { winePairing: null })`
- **Expected:** `winePairing === null`.

---

## 5. `addIngredientToPantry`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function addIngredientToPantry(
  pantry: Pantry,
  ingredient: Ingredient
): Pantry
```

### Input Parameters

- `pantry` (`Pantry`): existing pantry.
- `ingredient` (`Ingredient`): ingredient to add.

### Test Cases

#### 5.1 Adds ingredient to empty pantry
- **Setup:** `const pantry = createPantry(1, "Main");`
- **Action:** call `addIngredientToPantry(pantry, ingredient)`
- **Expected:** returned pantry has `pantryItems.length === 1` and contains the ingredient.

#### 5.2 Does not mutate original pantry
- **Setup:** pantry with some items.
- **Action:** call helper and compare.
- **Expected:**
  - Returned pantry is a new object (`!== pantry`).
  - `pantry.pantryItems` unchanged.

#### 5.3 Appends ingredient when pantry has existing items
- **Setup:** pantry with one item.
- **Action:** add a second ingredient.
- **Expected:** both original and new ingredient present in `pantryItems` in order.

---

## 6. `removeIngredientFromPantry`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function removeIngredientFromPantry(
  pantry: Pantry,
  itemID: number
): Pantry
```

### Input Parameters

- `pantry` (`Pantry`): pantry to remove from.
- `itemID` (number): ingredient ID to remove.

### Test Cases

#### 6.1 Removes ingredient with matching ID
- **Setup:** pantry with ingredients including one with `itemID = 3`.
- **Action:** `removeIngredientFromPantry(pantry, 3)`
- **Expected:** returned pantry no longer includes an ingredient with `itemID === 3`.

#### 6.2 No change if ID does not exist
- **Setup:** pantry with no ingredient having `itemID = 999`.
- **Action:** `removeIngredientFromPantry(pantry, 999)`
- **Expected:** `pantryItems` length and contents are unchanged.

#### 6.3 Does not mutate original pantry
- **Expected:**
  - Returned pantry is a new object.
  - Original `pantry.pantryItems` array remains unchanged.

---

## 7. `updateIngredientQuantityInPantry`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function updateIngredientQuantityInPantry(
  pantry: Pantry,
  itemID: number,
  newAmount: Quantity
): Pantry
```

### Input Parameters

- `pantry` (`Pantry`): pantry to modify.
- `itemID` (number): ingredient ID to update.
- `newAmount` (`Quantity`): new quantity (amount and unit).

### Test Cases

#### 7.1 Updates amount for matching ingredient
- **Setup:** pantry with ingredient `itemID = 1`, amount `{ amount: 3, unit: "pcs" }`.
- **Action:** `updateIngredientQuantityInPantry(pantry, 1, { amount: 6, unit: "pcs" })`
- **Expected:** returned pantry has that ingredient’s `amount.amount === 6` and `unit === "pcs"`.

#### 7.2 No change if ingredient not found
- **Setup:** pantry without ingredient `itemID = 999`.
- **Action:** call helper with `itemID = 999`.
- **Expected:** returned pantry’s `pantryItems` are equal to original.

#### 7.3 Immutable update for pantry and ingredient
- **Expected:**
  - Returned pantry is a new object.
  - The updated ingredient object is a new object.
  - Other (non-updated) ingredients keep their original object references.

---

## 8. `findIngredientInPantry`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function findIngredientInPantry(
  pantry: Pantry,
  name: string
): Ingredient | undefined
```

### Input Parameters

- `pantry` (`Pantry`): pantry to search.
- `name` (string): ingredient name to look up.

### Test Cases

#### 8.1 Finds ingredient by case-insensitive name
- **Setup:** pantry containing `itemName: "Eggs"`.
- **Action:** `findIngredientInPantry(pantry, "eggs")`.
- **Expected:** returns that `Ingredient`.

#### 8.2 Returns undefined when ingredient not present
- **Action:** search for non-existent name `"Unobtainium"`.
- **Expected:** `undefined`.

#### 8.3 Returns first match when duplicates exist
- **Setup:** pantry with multiple `itemName: "Sugar"` ingredients.
- **Action:** `findIngredientInPantry(pantry, "Sugar")`.
- **Expected:** returns the first matching ingredient from `pantryItems`.

---

## 9. `createSamplePantry`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function createSamplePantry(): Pantry
```

### Input Parameters

- None.

### Behavior Summary

- Creates a pantry with ID `1`, name `"Main Pantry"`.
- Adds three ingredients:
  - Eggs (12 pcs, with `image: "eggs.png"`).
  - Milk (1 l, with `possibleUnits: ["ml", "l"]`).
  - Flour (1000 g).

### Test Cases

#### 9.1 Returns pantry with expected structure and items
- **Action:** `const pantry = createSamplePantry();`
- **Expected:**
  - `pantryID === 1`
  - `pantryName === "Main Pantry"`
  - `pantryItems` length is `3`.
  - Contains items named `"Eggs"`, `"Milk"`, `"Flour"`.
  - `"Eggs"` has `image === "eggs.png"`.
  - `"Milk"` has `possibleUnits` including `"ml"` and `"l"`.

#### 9.2 Multiple calls create independent pantries
- **Action:** call `createSamplePantry()` twice.
- **Expected:** modifying `pantry1.pantryItems` does not affect `pantry2.pantryItems` (separate instances).

---

## 10. `createSampleRecipe`

**Location:** `pantryTypeHelper.ts`

**Method Signature:**

```ts
export function createSampleRecipe(): Recipe
```

### Input Parameters

- None.

### Behavior Summary

- Creates a `"Pancakes"` recipe (ID `1`) with:
  - `servings: 2`
  - `readyInMinutes: 15`
  - `ingredients`: Eggs (3 pcs), Milk (200 ml), Flour (100 g)
  - `dishTypes: ["breakfast", "main course"]`
  - `cuisines: ["American"]`
  - `diets: ["vegetarian"]`
  - `winePairing: null`

### Test Cases

#### 10.1 Returns recipe with expected structure and values
- **Action:** `const recipe = createSampleRecipe();`
- **Expected:**
  - `id === 1`
  - `title === "Pancakes"`
  - `servings === 2`
  - `readyInMinutes === 15`
  - `ingredients` length is `3`.
  - Contains ingredients `"Eggs"`, `"Milk"`, `"Flour"` with the expected quantities.
  - `dishTypes`, `cuisines`, and `diets` arrays contain the expected values.
  - `winePairing === null`.

#### 10.2 Ingredients created via `createIngredient` are well-formed
- **Expected:** each ingredient in `recipe.ingredients` is a valid `Ingredient` (has `itemID`, `itemName`, and `amount` with `amount`/`unit`).

