package tastebase.obj;

import tastebase.util.Quantity;

public class Ingredient {
    private int ingredientId;
    private String ingredientName;
    private String image;

    private Quantity amount;

    public Ingredient() {}

    public Ingredient(int ingredientId, String ingredientName, double quantity, String unit, String image) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.amount = new Quantity(quantity, unit);
        this.image = image;
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
    public String getImage() {
        return image;
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
    public void setImage(String image) {
        this.image = image;
    }
}
