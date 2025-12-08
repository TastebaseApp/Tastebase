package tastebase.api.external;

import java.util.HashMap;
import java.util.Map;

public class NutrientFilter {
    private Integer minCarbs;
    private Integer maxCarbs;
    private Integer minProtein;
    private Integer maxProtein;
    private Integer minCalories;
    private Integer maxCalories;
    private Integer minFat;
    private Integer maxFat;
    private Integer minAlcohol;
    private Integer maxAlcohol;
    private Integer minCaffeine;
    private Integer maxCaffeine;
    private Integer minCopper;
    private Integer maxCopper;
    private Integer minCalcium;
    private Integer maxCalcium;
    private Integer minCholine;
    private Integer maxCholine;
    private Integer minCholesterol;
    private Integer maxCholesterol;
    private Integer minFluoride;
    private Integer maxFluoride;
    private Integer minSaturatedFat;
    private Integer maxSaturatedFat;
    private Integer minVitaminA;
    private Integer maxVitaminA;
    private Integer minVitaminB;
    private Integer maxVitaminB;
    private Integer minVitaminC;
    private Integer maxVitaminC;
    private Integer minVitaminD;
    private Integer maxVitaminD;
    private Integer minVitaminE;
    private Integer maxVitaminE;
    private Integer minVitaminK;
    private Integer maxVitaminK;
    private Integer minVitaminB1;
    private Integer maxVitaminB1;
    private Integer minVitaminB2;
    private Integer maxVitaminB2;
    private Integer minVitaminB5;
    private Integer maxVitaminB5;
    private Integer minVitaminB3;
    private Integer maxVitaminB3;
    private Integer minVitaminB6;
    private Integer maxVitaminB6;
    private Integer minVitaminB12;
    private Integer maxVitaminB12;
    private Integer minFiber;
    private Integer maxFiber;
    private Integer minFolate;
    private Integer maxFolate;
    private Integer minFolicAcid;
    private Integer maxFolicAcid;
    private Integer minIodine;
    private Integer maxIodine;
    private Integer minIron;
    private Integer maxIron;
    private Integer minMagnesium;
    private Integer maxMagnesium;
    private Integer minManganese;
    private Integer maxManganese;
    private Integer minPhosphorus;
    private Integer maxPhosphorus;
    private Integer minPotassium;
    private Integer maxPotassium;
    private Integer minSelenium;
    private Integer maxSelenium;
    private Integer minSodium;
    private Integer maxSodium;
    private Integer minSugar;
    private Integer maxSugar;
    private Integer minZinc;
    private Integer maxZinc;

    public NutrientFilter() {}

    public Map<String, String> toQueryParams() {
        Map<String, String> params = new HashMap<>();

        putIfNotNull(params, "minCarbs", minCarbs);
        putIfNotNull(params, "maxCarbs", maxCarbs);
        putIfNotNull(params, "minProtein", minProtein);
        putIfNotNull(params, "maxProtein", maxProtein);
        putIfNotNull(params, "minCalories", minCalories);
        putIfNotNull(params, "maxCalories", maxCalories);
        putIfNotNull(params, "minFat", minFat);
        putIfNotNull(params, "maxFat", maxFat);
        putIfNotNull(params, "minAlcohol", minAlcohol);
        putIfNotNull(params, "maxAlcohol", maxAlcohol);
        putIfNotNull(params, "minCaffeine", minCaffeine);
        putIfNotNull(params, "maxCaffeine", maxCaffeine);
        putIfNotNull(params, "minCopper", minCopper);
        putIfNotNull(params, "maxCopper", maxCopper);
        putIfNotNull(params, "minCalcium", minCalcium);
        putIfNotNull(params, "maxCalcium", maxCalcium);
        putIfNotNull(params, "minCholine", minCholine);
        putIfNotNull(params, "maxCholine", maxCholine);
        putIfNotNull(params, "minCholesterol", minCholesterol);
        putIfNotNull(params, "maxCholesterol", maxCholesterol);
        putIfNotNull(params, "minFluoride", minFluoride);
        putIfNotNull(params, "maxFluoride", maxFluoride);
        putIfNotNull(params, "minSaturatedFat", minSaturatedFat);
        putIfNotNull(params, "maxSaturatedFat", maxSaturatedFat);
        putIfNotNull(params, "minVitaminA", minVitaminA);
        putIfNotNull(params, "maxVitaminA", maxVitaminA);
        putIfNotNull(params, "minVitaminB", minVitaminB);
        putIfNotNull(params, "maxVitaminB", maxVitaminB);
        putIfNotNull(params, "minVitaminC", minVitaminC);
        putIfNotNull(params, "maxVitaminC", maxVitaminC);
        putIfNotNull(params, "minVitaminD", minVitaminD);
        putIfNotNull(params, "maxVitaminD", maxVitaminD);
        putIfNotNull(params, "minVitaminE", minVitaminE);
        putIfNotNull(params, "maxVitaminE", maxVitaminE);
        putIfNotNull(params, "minVitaminK", minVitaminK);
        putIfNotNull(params, "maxVitaminK", maxVitaminK);
        putIfNotNull(params, "minVitaminB1", minVitaminB1);
        putIfNotNull(params, "maxVitaminB1", maxVitaminB1);
        putIfNotNull(params, "minVitaminB2", minVitaminB2);
        putIfNotNull(params, "maxVitaminB2", maxVitaminB2);
        putIfNotNull(params, "minVitaminB5", minVitaminB5);
        putIfNotNull(params, "maxVitaminB5", maxVitaminB5);
        putIfNotNull(params, "minVitaminB3", minVitaminB3);
        putIfNotNull(params, "maxVitaminB3", maxVitaminB3);
        putIfNotNull(params, "minVitaminB6", minVitaminB6);
        putIfNotNull(params, "maxVitaminB6", maxVitaminB6);
        putIfNotNull(params, "minVitaminB12", minVitaminB12);
        putIfNotNull(params, "maxVitaminB12", maxVitaminB12);
        putIfNotNull(params, "minFiber", minFiber);
        putIfNotNull(params, "maxFiber", maxFiber);
        putIfNotNull(params, "minFolate", minFolate);
        putIfNotNull(params, "maxFolate", maxFolate);
        putIfNotNull(params, "minFolicAcid", minFolicAcid);
        putIfNotNull(params, "maxFolicAcid", maxFolicAcid);
        putIfNotNull(params, "minIodine", minIodine);
        putIfNotNull(params, "maxIodine", maxIodine);
        putIfNotNull(params, "minIron", minIron);
        putIfNotNull(params, "maxIron", maxIron);
        putIfNotNull(params, "minMagnesium", minMagnesium);
        putIfNotNull(params, "maxMagnesium", maxMagnesium);
        putIfNotNull(params, "minManganese", minManganese);
        putIfNotNull(params, "maxManganese", maxManganese);
        putIfNotNull(params, "minPhosphorus", minPhosphorus);
        putIfNotNull(params, "maxPhosphorus", maxPhosphorus);
        putIfNotNull(params, "minPotassium", minPotassium);
        putIfNotNull(params, "maxPotassium", maxPotassium);
        putIfNotNull(params, "minSelenium", minSelenium);
        putIfNotNull(params, "maxSelenium", maxSelenium);
        putIfNotNull(params, "minSodium", minSodium);
        putIfNotNull(params, "maxSodium", maxSodium);
        putIfNotNull(params, "minSugar", minSugar);
        putIfNotNull(params, "maxSugar", maxSugar);
        putIfNotNull(params, "minZinc", minZinc);
        putIfNotNull(params, "maxZinc", maxZinc);

        return params;
    }

    private void putIfNotNull(Map<String, String> map, String key, Number value) {
        if (value != null) {
            map.put(key, value.toString());
        }
    }

    public Integer getMinCarbs() { return minCarbs; }
    public void setMinCarbs(Integer minCarbs) { this.minCarbs = minCarbs; }

    public Integer getMaxCarbs() { return maxCarbs; }
    public void setMaxCarbs(Integer maxCarbs) { this.maxCarbs = maxCarbs; }

    public Integer getMinProtein() { return minProtein; }
    public void setMinProtein(Integer minProtein) { this.minProtein = minProtein; }

    public Integer getMaxProtein() { return maxProtein; }
    public void setMaxProtein(Integer maxProtein) { this.maxProtein = maxProtein; }

    public Integer getMinCalories() { return minCalories; }
    public void setMinCalories(Integer minCalories) { this.minCalories = minCalories; }

    public Integer getMaxCalories() { return maxCalories; }
    public void setMaxCalories(Integer maxCalories) { this.maxCalories = maxCalories; }

    public Integer getMinFat() { return minFat; }
    public void setMinFat(Integer minFat) { this.minFat = minFat; }

    public Integer getMaxFat() { return maxFat; }
    public void setMaxFat(Integer maxFat) { this.maxFat = maxFat; }

    public Integer getMinAlcohol() { return minAlcohol; }
    public void setMinAlcohol(Integer minAlcohol) { this.minAlcohol = minAlcohol; }

    public Integer getMaxAlcohol() { return maxAlcohol; }
    public void setMaxAlcohol(Integer maxAlcohol) { this.maxAlcohol = maxAlcohol; }

    public Integer getMinCaffeine() { return minCaffeine; }
    public void setMinCaffeine(Integer minCaffeine) { this.minCaffeine = minCaffeine; }

    public Integer getMaxCaffeine() { return maxCaffeine; }
    public void setMaxCaffeine(Integer maxCaffeine) { this.maxCaffeine = maxCaffeine; }

    public Integer getMinCopper() { return minCopper; }
    public void setMinCopper(Integer minCopper) { this.minCopper = minCopper; }

    public Integer getMaxCopper() { return maxCopper; }
    public void setMaxCopper(Integer maxCopper) { this.maxCopper = maxCopper; }

    public Integer getMinCalcium() { return minCalcium; }
    public void setMinCalcium(Integer minCalcium) { this.minCalcium = minCalcium; }

    public Integer getMaxCalcium() { return maxCalcium; }
    public void setMaxCalcium(Integer maxCalcium) { this.maxCalcium = maxCalcium; }

    public Integer getMinCholine() { return minCholine; }
    public void setMinCholine(Integer minCholine) { this.minCholine = minCholine; }

    public Integer getMaxCholine() { return maxCholine; }
    public void setMaxCholine(Integer maxCholine) { this.maxCholine = maxCholine; }

    public Integer getMinCholesterol() { return minCholesterol; }
    public void setMinCholesterol(Integer minCholesterol) { this.minCholesterol = minCholesterol; }

    public Integer getMaxCholesterol() { return maxCholesterol; }
    public void setMaxCholesterol(Integer maxCholesterol) { this.maxCholesterol = maxCholesterol; }

    public Integer getMinFluoride() { return minFluoride; }
    public void setMinFluoride(Integer minFluoride) { this.minFluoride = minFluoride; }

    public Integer getMaxFluoride() { return maxFluoride; }
    public void setMaxFluoride(Integer maxFluoride) { this.maxFluoride = maxFluoride; }

    public Integer getMinSaturatedFat() { return minSaturatedFat; }
    public void setMinSaturatedFat(Integer minSaturatedFat) { this.minSaturatedFat = minSaturatedFat; }

    public Integer getMaxSaturatedFat() { return maxSaturatedFat; }
    public void setMaxSaturatedFat(Integer maxSaturatedFat) { this.maxSaturatedFat = maxSaturatedFat; }

    public Integer getMinVitaminA() { return minVitaminA; }
    public void setMinVitaminA(Integer minVitaminA) { this.minVitaminA = minVitaminA; }

    public Integer getMaxVitaminA() { return maxVitaminA; }
    public void setMaxVitaminA(Integer maxVitaminA) { this.maxVitaminA = maxVitaminA; }

    public Integer getMinVitaminB() { return minVitaminB; }
    public void setMinVitaminB(Integer minVitaminB) { this.minVitaminB = minVitaminB; }

    public Integer getMaxVitaminB() { return maxVitaminB; }
    public void setMaxVitaminB(Integer maxVitaminB) { this.maxVitaminB = maxVitaminB; }

    public Integer getMinVitaminC() { return minVitaminC; }
    public void setMinVitaminC(Integer minVitaminC) { this.minVitaminC = minVitaminC; }

    public Integer getMaxVitaminC() { return maxVitaminC; }
    public void setMaxVitaminC(Integer maxVitaminC) { this.maxVitaminC = maxVitaminC; }

    public Integer getMinVitaminD() { return minVitaminD; }
    public void setMinVitaminD(Integer minVitaminD) { this.minVitaminD = minVitaminD; }

    public Integer getMaxVitaminD() { return maxVitaminD; }
    public void setMaxVitaminD(Integer maxVitaminD) { this.maxVitaminD = maxVitaminD; }

    public Integer getMinVitaminE() { return minVitaminE; }
    public void setMinVitaminE(Integer minVitaminE) { this.minVitaminE = minVitaminE; }

    public Integer getMaxVitaminE() { return maxVitaminE; }
    public void setMaxVitaminE(Integer maxVitaminE) { this.maxVitaminE = maxVitaminE; }

    public Integer getMinVitaminK() { return minVitaminK; }
    public void setMinVitaminK(Integer minVitaminK) { this.minVitaminK = minVitaminK; }

    public Integer getMaxVitaminK() { return maxVitaminK; }
    public void setMaxVitaminK(Integer maxVitaminK) { this.maxVitaminK = maxVitaminK; }

    public Integer getMinVitaminB1() { return minVitaminB1; }
    public void setMinVitaminB1(Integer minVitaminB1) { this.minVitaminB1 = minVitaminB1; }

    public Integer getMaxVitaminB1() { return maxVitaminB1; }
    public void setMaxVitaminB1(Integer maxVitaminB1) { this.maxVitaminB1 = maxVitaminB1; }

    public Integer getMinVitaminB2() { return minVitaminB2; }
    public void setMinVitaminB2(Integer minVitaminB2) { this.minVitaminB2 = minVitaminB2; }

    public Integer getMaxVitaminB2() { return maxVitaminB2; }
    public void setMaxVitaminB2(Integer maxVitaminB2) { this.maxVitaminB2 = maxVitaminB2; }

    public Integer getMinVitaminB5() { return minVitaminB5; }
    public void setMinVitaminB5(Integer minVitaminB5) { this.minVitaminB5 = minVitaminB5; }

    public Integer getMaxVitaminB5() { return maxVitaminB5; }
    public void setMaxVitaminB5(Integer maxVitaminB5) { this.maxVitaminB5 = maxVitaminB5; }

    public Integer getMinVitaminB3() { return minVitaminB3; }
    public void setMinVitaminB3(Integer minVitaminB3) { this.minVitaminB3 = minVitaminB3; }

    public Integer getMaxVitaminB3() { return maxVitaminB3; }
    public void setMaxVitaminB3(Integer maxVitaminB3) { this.maxVitaminB3 = maxVitaminB3; }

    public Integer getMinVitaminB6() { return minVitaminB6; }
    public void setMinVitaminB6(Integer minVitaminB6) { this.minVitaminB6 = minVitaminB6; }

    public Integer getMaxVitaminB6() { return maxVitaminB6; }
    public void setMaxVitaminB6(Integer maxVitaminB6) { this.maxVitaminB6 = maxVitaminB6; }

    public Integer getMinVitaminB12() { return minVitaminB12; }
    public void setMinVitaminB12(Integer minVitaminB12) { this.minVitaminB12 = minVitaminB12; }

    public Integer getMaxVitaminB12() { return maxVitaminB12; }
    public void setMaxVitaminB12(Integer maxVitaminB12) { this.maxVitaminB12 = maxVitaminB12; }

    public Integer getMinFiber() { return minFiber; }
    public void setMinFiber(Integer minFiber) { this.minFiber = minFiber; }

    public Integer getMaxFiber() { return maxFiber; }
    public void setMaxFiber(Integer maxFiber) { this.maxFiber = maxFiber; }

    public Integer getMinFolate() { return minFolate; }
    public void setMinFolate(Integer minFolate) { this.minFolate = minFolate; }

    public Integer getMaxFolate() { return maxFolate; }
    public void setMaxFolate(Integer maxFolate) { this.maxFolate = maxFolate; }

    public Integer getMinFolicAcid() { return minFolicAcid; }
    public void setMinFolicAcid(Integer minFolicAcid) { this.minFolicAcid = minFolicAcid; }

    public Integer getMaxFolicAcid() { return maxFolicAcid; }
    public void setMaxFolicAcid(Integer maxFolicAcid) { this.maxFolicAcid = maxFolicAcid; }

    public Integer getMinIodine() { return minIodine; }
    public void setMinIodine(Integer minIodine) { this.minIodine = minIodine; }

    public Integer getMaxIodine() { return maxIodine; }
    public void setMaxIodine(Integer maxIodine) { this.maxIodine = maxIodine; }

    public Integer getMinIron() { return minIron; }
    public void setMinIron(Integer minIron) { this.minIron = minIron; }

    public Integer getMaxIron() { return maxIron; }
    public void setMaxIron(Integer maxIron) { this.maxIron = maxIron; }

    public Integer getMinMagnesium() { return minMagnesium; }
    public void setMinMagnesium(Integer minMagnesium) { this.minMagnesium = minMagnesium; }

    public Integer getMaxMagnesium() { return maxMagnesium; }
    public void setMaxMagnesium(Integer maxMagnesium) { this.maxMagnesium = maxMagnesium; }

    public Integer getMinManganese() { return minManganese; }
    public void setMinManganese(Integer minManganese) { this.minManganese = minManganese; }

    public Integer getMaxManganese() { return maxManganese; }
    public void setMaxManganese(Integer maxManganese) { this.maxManganese = maxManganese; }

    public Integer getMinPhosphorus() { return minPhosphorus; }
    public void setMinPhosphorus(Integer minPhosphorus) { this.minPhosphorus = minPhosphorus; }

    public Integer getMaxPhosphorus() { return maxPhosphorus; }
    public void setMaxPhosphorus(Integer maxPhosphorus) { this.maxPhosphorus = maxPhosphorus; }

    public Integer getMinPotassium() { return minPotassium; }
    public void setMinPotassium(Integer minPotassium) { this.minPotassium = minPotassium; }

    public Integer getMaxPotassium() { return maxPotassium; }
    public void setMaxPotassium(Integer maxPotassium) { this.maxPotassium = maxPotassium; }

    public Integer getMinSelenium() { return minSelenium; }
    public void setMinSelenium(Integer minSelenium) { this.minSelenium = minSelenium; }

    public Integer getMaxSelenium() { return maxSelenium; }
    public void setMaxSelenium(Integer maxSelenium) { this.maxSelenium = maxSelenium; }

    public Integer getMinSodium() { return minSodium; }
    public void setMinSodium(Integer minSodium) { this.minSodium = minSodium; }

    public Integer getMaxSodium() { return maxSodium; }
    public void setMaxSodium(Integer maxSodium) { this.maxSodium = maxSodium; }

    public Integer getMinSugar() { return minSugar; }
    public void setMinSugar(Integer minSugar) { this.minSugar = minSugar; }

    public Integer getMaxSugar() { return maxSugar; }
    public void setMaxSugar(Integer maxSugar) { this.maxSugar = maxSugar; }

    public Integer getMinZinc() { return minZinc; }
    public void setMinZinc(Integer minZinc) { this.minZinc = minZinc; }

    public Integer getMaxZinc() { return maxZinc; }
    public void setMaxZinc(Integer maxZinc) { this.maxZinc = maxZinc; }
}
