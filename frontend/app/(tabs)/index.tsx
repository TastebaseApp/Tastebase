import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import RecipeList from "@/components/recipeList";
import { ProfileIcon } from "@/components/ui/ProfileIcon";
import { RecipeSearchBar } from "@/components/ui/RecipeSearchBar";
import { Palette } from "@/constants/theme";
import { useRecipes } from "@/context/RecipeContext";

export default function HomeScreen() {
  const { searchRecipes, loading } = useRecipes();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Palette.white, dark: Palette.darkGrey }}
      headerImage={
        <View style={styles.headerContainer}>
          <Image
            source={require("@/assets/icons/LongTasteBaseLogo.png")}
            style={styles.Logo}
          />
          <ProfileIcon style={styles.profileIcon} />
        </View>
      }
    >
      <ThemedView style={styles.recipeListContainer}>
        <RecipeSearchBar onSearch={searchRecipes} />
        <RecipeList showFavorites={false} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  recipeListContainer: {
    width: '100%',
  },
  Logo: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    height: 40,
    width: 200,
    resizeMode: "contain",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});
