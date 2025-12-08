import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from '@/constants/theme';
import { FilterChip } from '@/utils/filterChipUtils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  chips: FilterChip[];
  onRemove: (chip: FilterChip) => void;
};

export function FilterChipsDisplay({ 
  chips, 
  onRemove
}: Props) {
  const bg = useThemeColor({}, 'background');
  const icon = useThemeColor({}, 'icon');
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.chipsContainer}>
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={[
              styles.chip,
              {
                backgroundColor: Colors[colorScheme].tint + '20',
                borderColor: Colors[colorScheme].tint + '60',
              },
            ]}
            onPress={() => onRemove(chip)}
          >
            <ThemedText style={styles.chipText} numberOfLines={1}>
              {chip.label}
            </ThemedText>
            <AntDesign 
              name="close-circle" 
              size={14} 
              color={icon} 
              style={styles.chipIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    flexShrink: 1,
  },
  chipIcon: {
    marginLeft: 2,
  },
});

