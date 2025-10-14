package tastebase.obj;

import tastebase.util.Quantity;

public class Item {
    private int itemID;
    private String itemName;

    private Quantity amount;
    
    public Item(int itemID, String itemName, double quantity, String unit) {
        this.itemID = itemID;
        this.itemName = itemName;
        this.amount = new Quantity(quantity, unit);
    }

    public int getItemID() {
        return itemID;
    }
    public String getItemName() {
        return itemName;
    }
    public Quantity getAmount() {
        return amount;
    }


    public void setItemID(int newID) {
        this.itemID = newID;
    }
    public void setName(String newName) {
        this.itemName = newName;
    }
    public void setAmount(Quantity newAmount) {
        this.amount = newAmount;
    }
}
