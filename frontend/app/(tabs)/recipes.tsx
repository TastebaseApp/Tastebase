import { StyleSheet } from 'react-native';

import RecipeList from '@/components/recipeList';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AddRecipeButton from '@/components/ui/AddRecipeButton';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="fork.knife"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Favorite Recipes</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>Hmm... What to cook..?</ThemedText>
        <AddRecipeButton />
        <RecipeList />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  subtitle: {
    fontStyle: 'italic',
  },
});
