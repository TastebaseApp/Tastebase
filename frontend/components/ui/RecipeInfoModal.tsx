import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
  useColorScheme,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedText } from "@/components/themed-text";
import { Recipe } from "@/types/pantry";
import { IconSymbol } from "./icon-symbol";
import FavoriteRecipeButton from "./favoriteRecipeButton";
import { Colors, Palette } from "@/constants/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onUseIngredients?: () => void;
};

export function RecipeInfoModal({ visible, onClose, recipe, onUseIngredients }: Props) {
  const screenWidth = Dimensions.get("window").width;
  const colorScheme = useColorScheme() || 'light';

  if (!recipe) return null;

  // Strip HTML tags from summary if present
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const cleanSummary = recipe.summary ? stripHtml(recipe.summary) : "";
  const ingredientCount = recipe.ingredients?.length || 0;
  const readyTime = recipe.readyInMinutes || 0;

  const styles = getStyles(colorScheme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton} hitSlop={8}>
              <AntDesign name="arrow-left" size={24} color={Colors[colorScheme].text} />
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
                <FavoriteRecipeButton recipe={recipe} style={styles.favoriteButton} />
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
                      <AntDesign name="clock-circle" size={16} color={Colors[colorScheme].text} />
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
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <View style={styles.ingredientsSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Ingredients
                </ThemedText>
                <View style={styles.ingredientsContainer}>
                  {recipe.ingredients.map((ingredient, index) => {
                    // Use original format if available, otherwise format from parsed data
                    const amount = ingredient.amount?.amount || 0;
                    const unit = ingredient.amount?.unit || "";
                    const name = ingredient.itemName || "";
                    
                    // Format: "amount unit name" or just "name" if no amount
                    let displayText = name;
                    if (amount > 0) {
                      const amountStr = amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
                      const unitStr = unit ? ` ${unit}` : "";
                      displayText = `${amountStr}${unitStr} ${name}`.trim();
                    }
                    
                    return (
                      <View key={index} style={styles.ingredientItem}>
                        <ThemedText type="default" style={styles.ingredientBullet}>
                          •{" "}
                        </ThemedText>
                        <ThemedText type="default" style={styles.ingredientText}>
                          {displayText}
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
                onPress={onUseIngredients}
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
                  {recipe.instructions.includes('\n') ? (
                    recipe.instructions
                      .split('\n')
                      .map(step => step.trim())
                      .filter(step => step.length > 0)
                      .map((step, index) => (
                        <View key={index} style={styles.instructionStep}>
                          <ThemedText type="default" style={styles.instructionStepNumber}>
                            {index + 1}.
                          </ThemedText>
                          <ThemedText type="default" style={styles.instructionStepText}>
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
      </View>
    </Modal>
  );
}

const getStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
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
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colorScheme === 'light' ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
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
    backgroundColor: colorScheme === 'light' ? Palette.lightGrey : Palette.darkGrey,
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
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: Colors[colorScheme].text,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  useIngredientsText: {
    color: Palette.black,
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

