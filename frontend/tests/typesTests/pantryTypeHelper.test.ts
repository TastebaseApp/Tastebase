import {
  createQuantity,
  createIngredient,
  createPantry,
  createRecipe,
  addIngredientToPantry,
  removeIngredientFromPantry,
  updateIngredientQuantityInPantry,
  findIngredientInPantry,
  createSamplePantry,
  createSampleRecipe,
} from "@/tests/pantryTypeHelper";
import type { Ingredient, Quantity, Pantry, Recipe } from "@/types/pantry";

describe("createQuantity", () => {
  it("creates a Quantity with correct fields", () => {
    const q = createQuantity(2.5, "cups");
    expect(q).toEqual({ amount: 2.5, unit: "cups" });
  });

  it("handles zero and negative amounts", () => {
    expect(createQuantity(0, "g")).toEqual({ amount: 0, unit: "g" });
    expect(createQuantity(-5, "g")).toEqual({ amount: -5, unit: "g" });
  });

  it("preserves arbitrary unit strings", () => {
    const q = createQuantity(1, "weird-unit");
    expect(q.unit).toBe("weird-unit");
  });
});

describe("createIngredient", () => {
  it("creates an Ingredient with required fields", () => {
    const amount: Quantity = { amount: 500, unit: "g" };
    const ing = createIngredient(1, "Flour", amount);

    expect(ing.itemID).toBe(1);
    expect(ing.itemName).toBe("Flour");
    expect(ing.amount).toEqual(amount);
    expect(ing.image).toBeUndefined();
    expect(ing.possibleUnits).toBeUndefined();
  });

  it("applies overrides to optional fields", () => {
    const amount = createQuantity(1, "l");
    const ing = createIngredient(2, "Milk", amount, {
      image: "milk.png",
      possibleUnits: ["ml", "l"],
    });

    expect(ing.image).toBe("milk.png");
    expect(ing.possibleUnits).toEqual(["ml", "l"]);
  });

  it("ignores attempts to override required fields via overrides", () => {
    const amount = createQuantity(100, "g");
    const ing = createIngredient(
      10,
      "Sugar",
      amount,
      {
        // cast to any to bypass TS – we want to ensure runtime spread order
        itemID: 999,
        itemName: "Wrong",
        amount: { amount: 1, unit: "kg" },
      } as any
    );

    expect(ing.itemID).toBe(10);
    expect(ing.itemName).toBe("Sugar");
    expect(ing.amount).toEqual(amount);
  });
});

describe("createPantry", () => {
  it("creates pantry with empty pantryItems", () => {
    const pantry = createPantry(1, "Main Pantry");

    expect(pantry.pantryID).toBe(1);
    expect(pantry.pantryName).toBe("Main Pantry");
    expect(pantry.pantryItems).toEqual([]);
  });
});

describe("createRecipe", () => {
  it("creates minimal recipe with id and title", () => {
    const recipe = createRecipe(1, "Pasta");

    expect(recipe.id).toBe(1);
    expect(recipe.title).toBe("Pasta");
    expect(recipe.ingredients).toBeUndefined();
    expect(recipe.servings).toBeUndefined();
  });

  it("applies overrides", () => {
    const recipe = createRecipe(2, "Soup", {
      servings: 4,
      readyInMinutes: 30,
      dishTypes: ["dinner"],
    });

    expect(recipe.id).toBe(2);
    expect(recipe.title).toBe("Soup");
    expect(recipe.servings).toBe(4);
    expect(recipe.readyInMinutes).toBe(30);
    expect(recipe.dishTypes).toEqual(["dinner"]);
  });

  it("allows winePairing to be null", () => {
    const recipe = createRecipe(3, "Stew", { winePairing: null });
    expect(recipe.winePairing).toBeNull();
  });

describe("addIngredientToPantry", () => {
  it("adds ingredient to empty pantry", () => {
    const pantry = createPantry(1, "Main");
    const ing = createIngredient(1, "Eggs", createQuantity(12, "pcs"));

    const updated = addIngredientToPantry(pantry, ing);

    expect(updated.pantryItems).toHaveLength(1);
    expect(updated.pantryItems[0]).toBe(ing);
  });

  it("does not mutate original pantry", () => {
    const pantry = createPantry(1, "Main");
    const ing = createIngredient(1, "Eggs", createQuantity(12, "pcs"));

    const updated = addIngredientToPantry(pantry, ing);

    expect(updated).not.toBe(pantry);
    expect(pantry.pantryItems).toEqual([]);
  });

  it("appends ingredient when pantry has existing items", () => {
    const pantry = createPantry(1, "Main");
    const ing1 = createIngredient(1, "Eggs", createQuantity(12, "pcs"));
    const ing2 = createIngredient(2, "Milk", createQuantity(1, "l"));

    const pantryWithOne = addIngredientToPantry(pantry, ing1);
    const pantryWithTwo = addIngredientToPantry(pantryWithOne, ing2);

    expect(pantryWithTwo.pantryItems).toEqual([ing1, ing2]);
  });
});

describe("removeIngredientFromPantry", () => {
  it("removes ingredient with matching ID", () => {
    let pantry = createPantry(1, "Main");
    const ing1 = createIngredient(1, "Eggs", createQuantity(12, "pcs"));
    const ing2 = createIngredient(2, "Milk", createQuantity(1, "l"));
    const ing3 = createIngredient(3, "Flour", createQuantity(500, "g"));

    pantry = addIngredientToPantry(addIngredientToPantry(addIngredientToPantry(pantry, ing1), ing2), ing3);

    const updated = removeIngredientFromPantry(pantry, 2);

    expect(updated.pantryItems).toHaveLength(2);
    expect(updated.pantryItems.find((ing) => ing.itemID === 2)).toBeUndefined();
  });

  it("has no effect if ID does not exist", () => {
    let pantry = createPantry(1, "Main");
    const ing1 = createIngredient(1, "Eggs", createQuantity(12, "pcs"));

    pantry = addIngredientToPantry(pantry, ing1);

    const updated = removeIngredientFromPantry(pantry, 999);

    expect(updated.pantryItems).toEqual(pantry.pantryItems);
  });

  it("does not mutate original pantry", () => {
    let pantry = createPantry(1, "Main");
    const ing1 = createIngredient(1, "Eggs", createQuantity(12, "pcs"));

    pantry = addIngredientToPantry(pantry, ing1);

    const updated = removeIngredientFromPantry(pantry, 1);

    expect(updated).not.toBe(pantry);
    expect(pantry.pantryItems).toHaveLength(1); // original still has the item
  });
});

describe("updateIngredientQuantityInPantry", () => {
  it("updates amount for matching ingredient", () => {
    let pantry = createPantry(1, "Main");
    const ing = createIngredient(1, "Eggs", createQuantity(3, "pcs"));
    pantry = addIngredientToPantry(pantry, ing);

    const updated = updateIngredientQuantityInPantry(
      pantry,
      1,
      createQuantity(6, "pcs")
    );

    expect(updated.pantryItems[0].amount).toEqual({ amount: 6, unit: "pcs" });
  });

  it("has no effect if ingredient not found", () => {
    let pantry = createPantry(1, "Main");
    const ing = createIngredient(1, "Eggs", createQuantity(3, "pcs"));
    pantry = addIngredientToPantry(pantry, ing);

    const updated = updateIngredientQuantityInPantry(
      pantry,
      999,
      createQuantity(10, "pcs")
    );

    expect(updated.pantryItems).toEqual(pantry.pantryItems);
  });

  it("performs immutable update for pantry and ingredient", () => {
    let pantry = createPantry(1, "Main");
    const ing1 = createIngredient(1, "Eggs", createQuantity(3, "pcs"));
    const ing2 = createIngredient(2, "Milk", createQuantity(1, "l"));
    pantry = addIngredientToPantry(addIngredientToPantry(pantry, ing1), ing2);

    const originalItems = pantry.pantryItems;
    const updated = updateIngredientQuantityInPantry(
      pantry,
      1,
      createQuantity(6, "pcs")
    );

    expect(updated).not.toBe(pantry);
    expect(updated.pantryItems).not.toBe(originalItems);
    expect(updated.pantryItems[0]).not.toBe(originalItems[0]); // updated
    expect(updated.pantryItems[1]).toBe(originalItems[1]); // unchanged
  });
});

describe("findIngredientInPantry", () => {
  it("finds ingredient by case-insensitive name", () => {
    let pantry = createPantry(1, "Main");
    const ing = createIngredient(1, "Eggs", createQuantity(12, "pcs"));
    pantry = addIngredientToPantry(pantry, ing);

    const found = findIngredientInPantry(pantry, "eggs");

    expect(found).toBe(ing);
  });

  it("returns undefined when ingredient is not present", () => {
    const pantry = createPantry(1, "Main");
    const found = findIngredientInPantry(pantry, "Unobtainium");
    expect(found).toBeUndefined();
  });

  it("returns first match when duplicates exist", () => {
    let pantry = createPantry(1, "Main");
    const ing1 = createIngredient(1, "Sugar", createQuantity(100, "g"));
    const ing2 = createIngredient(2, "Sugar", createQuantity(200, "g"));
    pantry = addIngredientToPantry(addIngredientToPantry(pantry, ing1), ing2);

    const found = findIngredientInPantry(pantry, "Sugar");
    expect(found).toBe(ing1);
  });
});

describe("createSamplePantry", () => {
  it("returns pantry with expected structure and items", () => {
    const pantry = createSamplePantry();

    expect(pantry.pantryID).toBe(1);
    expect(pantry.pantryName).toBe("Main Pantry");
    expect(pantry.pantryItems).toHaveLength(3);

    const names = pantry.pantryItems.map((ing) => ing.itemName).sort();
    expect(names).toEqual(["Eggs", "Flour", "Milk"]);

    const eggs = pantry.pantryItems.find((i) => i.itemName === "Eggs");
    const milk = pantry.pantryItems.find((i) => i.itemName === "Milk");

    expect(eggs?.image).toBe("eggs.png");
    expect(milk?.possibleUnits).toEqual(["ml", "l"]);
  });

  it("multiple calls create independent pantries", () => {
    const pantry1 = createSamplePantry();
    const pantry2 = createSamplePantry();

    // mutate pantry1 to ensure pantry2 is unaffected
    pantry1.pantryItems.push(
      createIngredient(999, "Extra", createQuantity(1, "pcs"))
    );

    expect(pantry1.pantryItems).toHaveLength(4);
    expect(pantry2.pantryItems).toHaveLength(3);
  });
});

describe("createSampleRecipe", () => {
  it("returns recipe with expected structure and values", () => {
    const recipe = createSampleRecipe();

    expect(recipe.id).toBe(1);
    expect(recipe.title).toBe("Pancakes");
    expect(recipe.servings).toBe(2);
    expect(recipe.readyInMinutes).toBe(15);

    expect(recipe.ingredients).toBeDefined();
    expect(recipe.ingredients).toHaveLength(3);

    const names = (recipe.ingredients || []).map((ing) => ing.itemName).sort();
    expect(names).toEqual(["Eggs", "Flour", "Milk"]);

    expect(recipe.dishTypes).toEqual(["breakfast", "main course"]);
    expect(recipe.cuisines).toEqual(["American"]);
    expect(recipe.diets).toEqual(["vegetarian"]);
    expect(recipe.winePairing).toBeNull();
  });

  it("creates well-formed Ingredient objects in ingredients array", () => {
    const recipe = createSampleRecipe();
    const ingredients = recipe.ingredients as Ingredient[];

    for (const ing of ingredients) {
      expect(typeof ing.itemID).toBe("number");
      expect(typeof ing.itemName).toBe("string");
      expect(typeof ing.amount.amount).toBe("number");
      expect(typeof ing.amount.unit).toBe("string");
    }
  });
});
});


