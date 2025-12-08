import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedText } from "@/components/themed-text";
import { Recipe } from "@/types/pantry";
import { IconSymbol } from "./icon-symbol";
import FavoriteRecipeButton from "./favoriteRecipeButton";
import { Colors, Palette } from "@/constants/theme";
import { usePantry } from "@/context/PantryContext";
import { compareRecipeToPantryDetails } from "@/utils/recipeIngredientComparer";
import { getStandardUnit } from "@/utils/unitConverter";
import { useState } from "react";
import { UseIngredientModal } from "./UseIngredientModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onUseIngredients?: () => void;
};

export function RecipeInfoModal({
  visible,
  onClose,
  recipe,
  onUseIngredients,
}: Props) {
  const screenWidth = Dimensions.get("window").width;
  const colorScheme = useColorScheme();
  const [useModalVisible, setUseModalVisible] = useState(false);

  if (!recipe) return null;

  // Strip HTML tags from summary if present
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const cleanSummary = recipe.summary ? stripHtml(recipe.summary) : "";
  const ingredientCount = recipe.ingredients?.length || 0;
  const readyTime = recipe.readyInMinutes || 0;

  const styles = getStyles(colorScheme);
  const { ingredients: pantryIngredients } = usePantry();
  // Build a minimal Pantry shape for the comparer util
  const pantryForCompare = {
    pantryID: 0,
    pantryName: "",
    pantryItems: pantryIngredients,
  };
  const availabilityDetails = recipe
    ? compareRecipeToPantryDetails(recipe, pantryForCompare)
    : [];

  // Annotate each recipe ingredient with pantry availability and a display string,
  // then sort so ingredients we have enough of appear first.
  const annotatedIngredients = (recipe.ingredients || []).map(
    (ingredient, index) => {
      const amount = ingredient.amount?.amount || 0;
      const unit = ingredient.amount?.unit || "";
      const name = ingredient.itemName || "";

      const detail = availabilityDetails[index];
      const missing = detail?.amountMissing?.amount ?? 0;

      const pantryMatch = pantryIngredients.find((p) => {
        if (p.itemID && ingredient.itemID && p.itemID === ingredient.itemID)
          return true;
        return p.itemName.trim().toLowerCase() === name.trim().toLowerCase();
      });

      let haveAmount = pantryMatch?.amount?.amount ?? 0;
      let haveUnit = pantryMatch?.amount?.unit ?? "";

      // Try converting pantry amount into recipe units for useful comparison/display
      try {
        if (haveUnit && unit && haveUnit.trim() && unit.trim() && amount > 0) {
          const pantryStd = getStandardUnit(haveAmount, haveUnit);
          const recipeStd = getStandardUnit(amount, unit);
          if (pantryStd.unit === recipeStd.unit && recipeStd.amount !== 0) {
            const pantryInRecipeUnits =
              (pantryStd.amount / recipeStd.amount) * amount;
            haveAmount = parseFloat(pantryInRecipeUnits.toFixed(2));
            haveUnit = unit;
          }
        }
      } catch (e) {
        // ignore conversion errors and fall back to raw values
      }

      const requiredAmount = amount;

      let status: "sufficient" | "partial" | "none" = "none";
      if (requiredAmount > 0) {
        if (haveAmount >= requiredAmount) {
          status = "sufficient";
        } else if (haveAmount > 0) status = "partial";
        else status = "none";
      } else {
        // If recipe doesn't specify amount, treat presence as sufficient
        status = pantryMatch ? "sufficient" : "none";
      }

      // Colors: sufficient = normal text, partial = yellow, none = red
      let statusColor = Colors[colorScheme].text;
      if (status === "partial") statusColor = "#f1c40f";
      if (status === "none") statusColor = "#e74c3c";

      const requiredStr =
        requiredAmount % 1 === 0
          ? requiredAmount.toString()
          : requiredAmount.toFixed(2);
      const haveStr =
        haveAmount % 1 === 0 ? haveAmount.toString() : haveAmount.toFixed(2);
      const unitDisplay = unit || haveUnit || "";
      const annotatedText = unitDisplay
        ? `${haveStr}/${requiredStr} ${unitDisplay} ${name}`
        : `${haveStr}/${requiredStr} ${name}`;

      return { ingredient, index, status, statusColor, annotatedText };
    }
  );

  const sortOrder = { sufficient: 0, partial: 1, none: 2 } as Record<
    string,
    number
  >;
  const sortedIngredients = annotatedIngredients.slice().sort((a, b) => {
    const byStatus = sortOrder[a.status] - sortOrder[b.status];
    if (byStatus !== 0) return byStatus;
    return a.index - b.index;
  });

  // Build list of ingredients the user can reduce (sufficient or partial)
  const ingredientsToUse = sortedIngredients
    .filter((i) => i.status === "sufficient" || i.status === "partial")
    .map((i) => {
      const ingredient = i.ingredient;

      const requiredAmount = ingredient.amount?.amount ?? 0;
      const requiredUnit = ingredient.amount?.unit ?? "";

      // matching pantry item
      const pantryMatch = pantryIngredients.find(
        (p) =>
          (p.itemID && ingredient.itemID && p.itemID === ingredient.itemID) ||
          p.itemName.trim().toLowerCase() ===
            ingredient.itemName.trim().toLowerCase()
      );

      const pantryAmount = pantryMatch?.amount?.amount ?? 0;
      const pantryUnit = pantryMatch?.amount?.unit ?? "";

      // 👇 default to remove:
      // - sufficient: recipe amount
      // - partial: all we have
      const defaultToRemove = Math.min(requiredAmount, pantryAmount);

      return {
        itemID: pantryMatch?.itemID ?? ingredient.itemID ?? 0,
        itemName: pantryMatch?.itemName ?? ingredient.itemName ?? "",
        amount: {
          amount: defaultToRemove, // 👈 what shows in the modal input
          unit: requiredUnit || pantryUnit || "", // prefer recipe unit if present
        },
        originalAmount: pantryAmount, // 👈 full pantry amount
      };
    });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backButton}
              hitSlop={8}
            >
              <AntDesign
                name="arrow-left"
                size={24}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Recipe Image */}
            {recipe.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recipeImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Recipe Title */}
            <View style={styles.titleSection}>
              <View style={styles.titleRow}>
                <FavoriteRecipeButton
                  recipe={recipe}
                  style={styles.favoriteButton}
                />
                <ThemedText type="title" style={styles.recipeTitle}>
                  {recipe.title}
                </ThemedText>
              </View>
            </View>

            {/* Recipe Section */}
            <View style={styles.recipeSection}>
              <View style={styles.recipeHeader}>
                <View style={styles.timeInfo}>
                  {recipe.readyInMinutes && (
                    <>
                      <AntDesign
                        name="clock-circle"
                        size={16}
                        color={Colors[colorScheme].text}
                      />
                      <ThemedText type="default" style={styles.timeText}>
                        Ready in: {readyTime} minutes
                      </ThemedText>
                    </>
                  )}
                  {recipe.servings && (
                    <ThemedText type="default" style={styles.servingsText}>
                      Serves: {recipe.servings}
                    </ThemedText>
                  )}
                </View>
              </View>

              {/* Cuisines and Diets */}
              <View style={styles.metadataRow}>
                {recipe.cuisines && recipe.cuisines.length > 0 && (
                  <View style={styles.metadataItem}>
                    <ThemedText type="default" style={styles.metadataLabel}>
                      Cuisine:
                    </ThemedText>
                    <ThemedText type="default" style={styles.metadataValue}>
                      {recipe.cuisines.join(", ")}
                    </ThemedText>
                  </View>
                )}
                {recipe.diets && recipe.diets.length > 0 && (
                  <View style={styles.metadataItem}>
                    <ThemedText type="default" style={styles.metadataLabel}>
                      Diet:
                    </ThemedText>
                    <ThemedText type="default" style={styles.metadataValue}>
                      {recipe.diets.join(", ")}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>

            {/* Description */}
            {cleanSummary && (
              <View style={styles.descriptionSection}>
                <ThemedText type="default" style={styles.descriptionText}>
                  {cleanSummary}
                </ThemedText>
              </View>
            )}

            {/* Ingredients Section */}
            {sortedIngredients && sortedIngredients.length > 0 && (
              <View style={styles.ingredientsSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Ingredients
                </ThemedText>
                <View style={styles.ingredientsContainer}>
                  {sortedIngredients.map((item) => {
                    return (
                      <View
                        key={`${item.ingredient.itemID ?? item.index}-${
                          item.index
                        }`}
                        style={styles.ingredientItem}
                      >
                        <ThemedText
                          type="default"
                          style={[
                            styles.ingredientBullet,
                            { color: item.statusColor },
                          ]}
                        >
                          •{" "}
                        </ThemedText>
                        <ThemedText
                          type="default"
                          style={[
                            styles.ingredientText,
                            { color: item.statusColor },
                          ]}
                        >
                          {item.annotatedText}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Use Ingredients Button */}
            {onUseIngredients && (
              <TouchableOpacity
                style={styles.useIngredientsButton}
                onPress={() => setUseModalVisible(true)}
                activeOpacity={0.8}
              >
                <ThemedText type="subtitle" style={styles.useIngredientsText}>
                  Use Ingredients
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Instructions Section */}
            {recipe.instructions && (
              <View style={styles.instructionsSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Instructions
                </ThemedText>
                <View style={styles.instructionsContent}>
                  {recipe.instructions.includes("\n") ? (
                    recipe.instructions
                      .split("\n")
                      .map((step) => step.trim())
                      .filter((step) => step.length > 0)
                      .map((step, index) => (
                        <View key={index} style={styles.instructionStep}>
                          <ThemedText
                            type="default"
                            style={styles.instructionStepNumber}
                          >
                            {index + 1}.
                          </ThemedText>
                          <ThemedText
                            type="default"
                            style={styles.instructionStepText}
                          >
                            {step}
                          </ThemedText>
                        </View>
                      ))
                  ) : (
                    <ThemedText type="default" style={styles.instructionsText}>
                      {recipe.instructions}
                    </ThemedText>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        <UseIngredientModal
          visible={useModalVisible}
          onClose={() => setUseModalVisible(false)}
          ingredients={ingredientsToUse} // whatever you're passing in
        />
      </View>
    </Modal>
  );
}

const getStyles = (colorScheme: "light" | "dark") =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: Colors[colorScheme].background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "100%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor:
        colorScheme === "light"
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(255, 255, 255, 0.1)",
    },
    backButton: {
      marginRight: 12,
      padding: 4,
    },
    headerTitle: {
      fontSize: 14,
      opacity: 0.7,
      color: Colors[colorScheme].text,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    imageContainer: {
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    recipeImage: {
      width: "100%",
      maxWidth: 400,
      minHeight: 200,
      maxHeight: 400,
      backgroundColor:
        colorScheme === "light" ? Palette.white : Palette.darkGrey,
    },
    titleSection: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    recipeTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: Colors[colorScheme].text,
      lineHeight: 30,
      flex: 1,
      marginLeft: 8,
    },
    favoriteButton: {
      transform: [{ scale: 1.5 }],
    },
    recipeSection: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    recipeHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    sectionTitle: {
      fontWeight: "600",
      flex: 1,
      color: Colors[colorScheme].text,
    },
    timeInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    timeText: {
      marginRight: 12,
      color: Colors[colorScheme].text,
    },
    servingsText: {
      fontWeight: "500",
      color: Colors[colorScheme].text,
    },
    ingredientCount: {
      fontWeight: "500",
    },
    metadataRow: {
      marginTop: 8,
      gap: 8,
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metadataLabel: {
      fontWeight: "600",
      color: Colors[colorScheme].icon,
    },
    metadataValue: {
      color: Colors[colorScheme].text,
    },
    descriptionSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    descriptionText: {
      lineHeight: 22,
      color: Colors[colorScheme].text,
      fontSize: 15,
    },
    ingredientsSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: "center",
    },
    ingredientsContainer: {
      width: "100%",
      maxWidth: 400,
      borderWidth: 2,
      borderColor: Colors[colorScheme].text,
      borderRadius: 8,
      padding: 16,
      marginTop: 12,
      backgroundColor: Colors[colorScheme].background,
    },
    ingredientItem: {
      flexDirection: "row",
      marginVertical: 4,
      alignItems: "flex-start",
    },
    ingredientBullet: {
      marginRight: 4,
      color: Colors[colorScheme].text,
    },
    ingredientText: {
      flex: 1,
      lineHeight: 20,
      color: Colors[colorScheme].text,
    },
    useIngredientsButton: {
      backgroundColor: colorScheme === "light" ? Palette.black : Palette.white,
      borderColor: Colors[colorScheme].text,
      marginHorizontal: 16,
      marginVertical: 16,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    useIngredientsText: {
      color: colorScheme === "light" ? Palette.white : Palette.black,
      fontWeight: "600",
    },
    instructionsSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    instructionsContent: {
      marginTop: 8,
    },
    instructionStep: {
      flexDirection: "row",
      marginBottom: 12,
      alignItems: "flex-start",
    },
    instructionStepNumber: {
      fontWeight: "600",
      marginRight: 8,
      color: Colors[colorScheme].text,
      minWidth: 24,
    },
    instructionStepText: {
      flex: 1,
      lineHeight: 22,
      color: Colors[colorScheme].text,
      fontSize: 15,
    },
    instructionsText: {
      lineHeight: 22,
      color: Colors[colorScheme].text,
      fontSize: 15,
    },
  });
