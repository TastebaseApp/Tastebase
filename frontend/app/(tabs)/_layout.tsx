import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // 🔹 Hides text labels
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/icons/Large_HomeIcon_Selected_Gradient.png')
                  : require('@/assets/icons/Large_HomeIcon_Unselected.png')
              }
              style={{width: 35, height: 35, resizeMode: 'contain'}}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="recipes"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/icons/Large_UserIcon_Selected_Gradient.png')
                  : require('@/assets/icons/Large_UserIcon_Unselected.png')
              }
              style={styles.tabIcon}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pantry"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/icons/Large_pantryIcon_Selected_Gradient.png')
                  : require('@/assets/icons/Large_pantryIcon_Unselected.png')
              }
              style={styles.tabIcon}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 28, 
    height: 28, 
    resizeMode: 'contain'
  }
});
