import { StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  onPress: () => void;
};

/**
 * Utility function to add quantity to an existing ingredient
 * @param addIngredient - The addIngredient function from usePantry hook
 * @param itemID - The ID of the ingredient
 * @param amountToAdd - The amount to add
 * @param unit - The unit of measurement
 * @param ingredientName - The name of the ingredient
 */
export async function addIngredientQuantity(
  addIngredient: (id: string, amt: number, unit: string, name: string) => Promise<void>,
  itemID: string,
  amountToAdd: number,
  unit: string,
  ingredientName: string
): Promise<void> {
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    return;
  }
  
  try {
    await addIngredient(itemID, amountToAdd, unit, ingredientName);
  } catch (error) {
    throw error;
  }
}

export function AddIngredientButton({ onPress }: Props) {
  const iconColor = useThemeColor({}, 'text');
  return (
    <TouchableOpacity
      style={[styles.addButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <AntDesign name="plus" size={32} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});