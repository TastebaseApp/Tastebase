/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Palette = {
  gradientStart: '#f2b63d',
  gradientEnd: '#d46e33',
  black: '#000000',
  white: '#FFFFFF',
  lightGrey: '#d9d9d9',
  grey: '#8c8c8c',
  darkGrey: '#202020',
};

export const Colors = {
  light: {
    text: Palette.black,
    background: Palette.white,
    tint: Palette.gradientEnd,
    icon: Palette.grey,
    tabIconDefault: Palette.black, 
    tabIconSelected: Palette.gradientEnd,
  },
  dark: {
    text: Palette.white,
    background: Palette.darkGrey,
    tint: Palette.gradientEnd,
    icon: Palette.grey,
    tabIconDefault: Palette.white,
    tabIconSelected: Palette.gradientEnd,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
