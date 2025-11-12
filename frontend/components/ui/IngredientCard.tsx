import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";
import { StyleSheet, Image, useColorScheme, View, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/theme";
import { Ingredient } from "../../types/pantry";
import RemoveIngredientButton from "./RemoveIngredientButton";
import { useThemeColor } from "../../hooks/use-theme-color";
import { usePantry } from "../../context/PantryContext";

type Props = {
  ingredient: Ingredient;
  cardWidth: number;
};

export default function IngredientCard({ ingredient, cardWidth }: Props) {
  const colorScheme = useColorScheme() || 'light';
  const placeholderBg = useThemeColor({ light: '#f5f5f5', dark: '#2a2a2a' }, 'background');
  const imageBg = useThemeColor({ light: '#f0f0f0', dark: '#1a1a1a' }, 'background');
  const { removeIngredient } = usePantry();
  const iconColor = useThemeColor({}, 'text');

  // Calculate card height to make it more square (slightly taller than width)
  const cardHeight = cardWidth * 1.25;

  const handleDelete = async () => {
    console.log('[IngredientCard] handleDelete called', { 
      itemID: ingredient.itemID, 
      itemIDType: typeof ingredient.itemID,
      ingredientName: ingredient.itemName 
    });
    await removeIngredient(ingredient.itemID);
  };

  return (
    <ThemedView style={[styles.card, { borderColor: Colors[colorScheme].tint, minHeight: cardHeight }]}>
      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <ThemedText style={[styles.deleteButtonText, { color: iconColor }]}>−</ThemedText>
      </TouchableOpacity>
      
      {/* Image */}
      {ingredient.image ? (
        <Image
          source={{ uri: ingredient.image }}
          style={[styles.image, { backgroundColor: imageBg, height: cardWidth }]}
          resizeMode="cover"
        />
      ) : (
        <ThemedView 
          style={[
            styles.imagePlaceholder, 
            { 
              borderColor: Colors[colorScheme].tint,
              backgroundColor: placeholderBg,
              height: cardWidth,
            }
          ]}
        >
          <ThemedText type="default" style={styles.placeholderText}>
            No Image
          </ThemedText>
        </ThemedView>
      )}
      
      {/* Ingredient Name and Controls */}
      <ThemedView style={styles.content}>
        <ThemedText type="subtitle" style={styles.name} numberOfLines={2}>
          {ingredient.itemName}
        </ThemedText>
        
        {/* Amount and Remove Button */}
        <View style={styles.footer}>
          <RemoveIngredientButton
            itemID={ingredient.itemID}
            currentAmount={ingredient.amount.amount}
            unit={ingredient.amount.unit}
            ingredientName={ingredient.itemName}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    width: '100%',
  },
  image: {
    width: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  placeholderText: {
    opacity: 0.5,
    fontSize: 12,
  },
  content: {
    padding: 10,
    paddingBottom: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
  footer: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 40,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 28,
  },
});

