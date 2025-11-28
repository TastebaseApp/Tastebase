import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemePreference } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';

export function ColorSchemeWidget() {
  const { preference, setPreference } = useThemePreference();
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');

  const options: Array<{ value: 'light' | 'dark' | 'default'; label: string }> = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'default', label: 'Auto' },
  ];

  return (
    <ThemedView>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        Color Scheme
      </ThemedText>
      <View style={[styles.segmentedControl, { borderColor: icon + '33' }]}>
        {options.map((option) => {
          const isSelected = preference === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.segment,
                isSelected && {
                  backgroundColor: tint,
                },
                !isSelected && {
                  backgroundColor: 'transparent',
                },
              ]}
              onPress={() => setPreference(option.value)}
              activeOpacity={0.7}
            >
              <ThemedText
                lightColor={isSelected ? '#fff' : Colors.light.text}
                darkColor={isSelected ? '#fff' : Colors.dark.text}
                style={styles.segmentText}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    marginVertical: 6,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 0,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

