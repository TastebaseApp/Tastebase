import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabLayout() {
  const backgroundColor = useThemeColor({}, 'background');
  const pathname = usePathname();
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Check the initial pathname and if it is a tab route, navigate to it
    // This ensures the tab bar is synced with the current route
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (pathname && (pathname === '/pantry' || pathname === '/recipes')) {
        setTimeout(() => {
          router.replace(pathname as any);
        }, 0);
      }
    }
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // 🔹 Hides text labels
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: backgroundColor,
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
                  ? require('@/assets/icons/Large_FavoritesIcon_Selected_Gradient.png')
                  : require('@/assets/icons/Large_FavoritesIcon_Unselected.png')
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
