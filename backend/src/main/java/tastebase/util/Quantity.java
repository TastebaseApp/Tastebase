package tastebase.util;

public class Quantity {
    private double amount;
    private String unit;

    public Quantity(double amount, String unit) {
        this.amount = amount;
        this.unit = unit;
    }

    public double getAmount() {
        return amount;
    }

    public String getUnit() {
        return unit;
    }

    public void setAmount(double newAmount) {
        this.amount = newAmount;
    }

    public void setUnit(String newUnit) {
        this.unit = newUnit;
    }
    
    // Our custom pair class can have unit conversion for convenience, something to keep in mind for the future
    public double convertTo(String newUnit) {
        // todo: implement unit conversion logic
        return -1; // placeholder
    }
}
