import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import RecipeList from '@/components/recipeList';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AddRecipeButton from '@/components/ui/AddRecipeButton';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#FFFFFF', dark: '#1D3D47' }}
          headerImage={
            <View style = {styles.headerContainer}>
              <Image
                source={require('@/assets/icons/LongTasteBaseLogo.png')}
                style={styles.Logo}
              />
            </View>
          }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Favorite Recipes</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>Hmm... What to cook..?</ThemedText>
        <AddRecipeButton />
        <RecipeList />
        <RecipeList showFavorites={true} />
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
  Logo: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    height: 30,
    width: 200,
    resizeMode: 'contain',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});
