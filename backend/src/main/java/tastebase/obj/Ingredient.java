package tastebase.obj;

import tastebase.util.Quantity;

public class Ingredient {
    private int ingredientId;
    private String ingredientName;

    private Quantity amount;

    public Ingredient() {}

    public Ingredient(int ingredientId, String ingredientName, double quantity, String unit) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.amount = new Quantity(quantity, unit);
    }

    public int getIngredientId() {
        return ingredientId;
    }
    public String getIngredientName() {
        return ingredientName;
    }
    public Quantity getAmount() {
        return amount;
    }


    public void setIngredientId(int newID) {
        this.ingredientId = newID;
    }
    public void setIngredientName(String newName) {
        this.ingredientName = newName;
    }
    public void setAmount(Quantity newAmount) {
        this.amount = newAmount;
    }
}
