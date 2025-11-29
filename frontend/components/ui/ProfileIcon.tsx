import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ProfileCard } from './ProfileCard';
import { useAuth } from '@/context/AuthContext';

const ICON_SIZE = 40; // Fixed icon size

type Props = {
  style?: ViewStyle;
};

export function ProfileIcon({ style }: Props) {
  const [showCard, setShowCard] = useState(false);
  const iconColor = useThemeColor({}, 'tint');
  const { userPictureURI } = useAuth();

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
        {userPictureURI ? (
          <Image
            source={{ uri: userPictureURI }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person-circle" size={ICON_SIZE} color={iconColor} />
        )}
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
  profileImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
  },
});

