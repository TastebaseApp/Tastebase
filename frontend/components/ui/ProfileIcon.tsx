import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ProfileCard } from './ProfileCard';

const ICON_SIZE = 40; // Fixed icon size

type Props = {
  style?: ViewStyle;
};

export function ProfileIcon({ style }: Props) {
  const [showCard, setShowCard] = useState(false);
  const iconColor = useThemeColor({}, 'tint');

  const handlePress = () => {
    setShowCard(true);
  };

  const handleClose = () => {
    setShowCard(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.container, style]}
        hitSlop={8}
        activeOpacity={0.7}
      >
        <Ionicons name="person-circle" size={ICON_SIZE} color={iconColor} />
      </TouchableOpacity>

      <ProfileCard
        visible={showCard}
        onClose={handleClose}
        iconColor={iconColor}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

