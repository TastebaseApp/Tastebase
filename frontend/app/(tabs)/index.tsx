import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import RecipeList from '@/components/recipeList';
import { ProfileIcon } from '@/components/ui/ProfileIcon';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#1D3D47' }}
      headerImage={
        <View style = {styles.headerContainer}>
          <Image
            source={require('@/assets/icons/LongTasteBaseLogo.png')}
            style={styles.Logo}
          />
          <ProfileIcon style={styles.profileIcon} />
        </View>
      }>
      <ThemedView style={styles.recipeListContainer}>
        <RecipeList showFavorites={false} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  recipeListContainer: {
    alignSelf: 'center',
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
  profileIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
