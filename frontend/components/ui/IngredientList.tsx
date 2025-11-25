import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";
import {
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { usePantry } from "../../context/PantryContext";
import IngredientCard from "./IngredientCard";

//const containerPadding = 16;
//const gap = 12;

export default function IngredientList() {
  const { ingredients, loading, error } = usePantry(); // Pantry object from PantryContext
  const { width: screenWidth } = useWindowDimensions();

  // Calculate card width dynamically based on current window dimensions
  // Using narrower cards (45% of available width per card) with increased gap for a more square appearance
  //const availableWidth = screenWidth - (containerPadding * 2);
  // Use 0.45 multiplier instead of 0.5 to make cards narrower and more square
  //const cardWidth = (availableWidth * 0.45);

  const MIN_CARD_WIDTH = 100; // smallest you’ll allow
  const MAX_CARD_WIDTH = 230; // largest you’ll allow

  // Figure out how many columns we can fit
  let numColumns = Math.floor((screenWidth) / (MIN_CARD_WIDTH));

  // Actual card width based on that column count
  const cardWidth = Math.min(
    MAX_CARD_WIDTH,
    (screenWidth * (numColumns - 1)) / numColumns
  );

  if (loading) return <ActivityIndicator />;

  if (error)
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="default">{error}</ThemedText>
      </ThemedView>
    );

  if (ingredients.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText type="defaultSemiBold" style={styles.emptyText}>
          Your pantry is empty. Select the + button to add ingredients.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.grid}>
        {ingredients.map((item, index) => (
          <ThemedView
            key={item.itemID}
            style={[
              styles.cardWrapper,
              { width: cardWidth },
              index % 2 === 0 ? { marginRight: 4 } : {},
            ]}
          >
            <IngredientCard ingredient={item} cardWidth={cardWidth} />
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16
  },
  cardWrapper: {
    marginBottom: 6,
  },
  emptyContainer: {
    marginHorizontal: 20,
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});
