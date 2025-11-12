import { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { usePantry } from '@/context/PantryContext';
import { addIngredientQuantity } from './AddIngredientButton';

type Props = {
  itemID: number;
  currentAmount: number;
  unit: string;
  ingredientName: string;
};

export default function RemoveIngredientButton({ itemID, currentAmount, unit, ingredientName }: Props) {
  const { removeIngredient, addIngredient, reduceIngredient } = usePantry();
  const [val, setVal] = useState('1');
  const iconColor = useThemeColor({}, 'text');

  const onMinus = async (e?: any) => {
    // Prevent default behavior to avoid page refresh
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }

    const amountToSubtract = parseFloat(val);
    console.log('[RemoveIngredientButton] onMinus called', { val, amountToSubtract, itemID, unit, ingredientName });

    if (isNaN(amountToSubtract) || amountToSubtract <= 0) {
      console.log('[RemoveIngredientButton] Invalid amount, not reducing');
      return;
    }

    try {
      await reduceIngredient(itemID, amountToSubtract);
      setVal('1');
    } catch (error) {
      console.error('[RemoveIngredientButton] Failed to reduce ingredient:', error);
      // Optionally show error to user
    }
  };

  const onPlus = async (e?: any) => {
    // Prevent default behavior to avoid page refresh
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    
    const amountToAdd = parseFloat(val);
    console.log('[RemoveIngredientButton] onPlus called', { val, amountToAdd, itemID, unit, ingredientName });
    
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      console.log('[RemoveIngredientButton] Invalid amount, not adding');
      return;
    }
    
    try {
      await addIngredientQuantity(addIngredient, itemID, amountToAdd, unit, ingredientName);
      setVal('1');
    } catch (error) {
      console.error('[RemoveIngredientButton] Failed to add ingredient:', error);
      // Optionally show error to user
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={[styles.minus, { borderColor: iconColor }]} 
          onPress={onMinus}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.minusText}>−</ThemedText>
        </TouchableOpacity>
        <TextInput
          value={val}
          onChangeText={setVal}
          placeholder={'1'}
          placeholderTextColor={iconColor}
          keyboardType="numeric"
          style={[
            styles.input,
            { color: iconColor, borderColor: iconColor + '33' },
          ]}
        />
        <TouchableOpacity 
          style={[styles.plus, { borderColor: iconColor }]} 
          onPress={onPlus}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.plusText}>+</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.total}>
        {currentAmount} {unit}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  input: {
    width: 50, 
    paddingHorizontal: 6, 
    paddingVertical: 4,
    borderWidth: 1, 
    borderRadius: 4, 
    textAlign: 'center',
    marginHorizontal: 6,
  },
  minus: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderWidth: 1, 
    borderRadius: 4,
  },
  minusText: { 
    fontWeight: '700', 
    fontSize: 14,
  },
  plus: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderWidth: 1, 
    borderRadius: 4,
  },
  plusText: { 
    fontWeight: '700', 
    fontSize: 14,
  },
  total: { 
    fontSize: 12,
    textAlign: 'center',
  },
});