import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePantry } from '@/context/PantryContext';

type Props = {
  itemID: number;
  currentAmount: number;
  unit: string;
};

export default function RemoveIngredientButton({ itemID, currentAmount, unit }: Props) {
  const { removeAmount } = usePantry();
  const [val, setVal] = useState('');
  const iconColor = useThemeColor({}, 'text');

  const onMinus = async () => {
    const amt = parseFloat(val);
    if (!Number.isFinite(amt) || amt <= 0) return;
    await removeAmount(itemID, amt);
    setVal('');
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        value={val}
        onChangeText={setVal}
        placeholder={'0'}
        placeholderTextColor={iconColor}
        keyboardType="numeric"
        style={[
          styles.input,
          { color: iconColor, borderColor: iconColor + '33' },
        ]}

        
        
      />
      <TouchableOpacity style={[styles.minus, { borderColor: iconColor }]} onPress={onMinus}>
        <ThemedText style={styles.minusText}>−</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.total}>
        {currentAmount} {unit}

      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    width: 70, paddingHorizontal: 8, paddingVertical: 6,
    borderWidth: 1, borderRadius: 6, textAlign: 'center',
  },
  minus: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderRadius: 6 },
  minusText: { fontWeight: '700', fontSize: 16 },
  total: { marginLeft: 4 },
});