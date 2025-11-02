import { StyleSheet, Modal, View } from 'react-native';
import { useState } from 'react';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'expo-image';

import { ThemedView as ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { AddIngredientButton } from '@/components/ui/AddIngredientButton';
import { AddIngredientModal } from '@/components/ui/AddIngredientModal';
import IngredientList from '@/components/ui/IngredientList';
import { usePantry } from '@/context/PantryContext';


export default function TabPantryScreen() {
  const [showAdd, setShowAdd] = useState(false);
  const { addItem } = usePantry();
  const handleAdd = async (items: { amount: number; unit: string; name: string }[]) => {
    for (const it of items) {
      await addItem(it.amount, it.unit, it.name);
    }
    setShowAdd(false);
  };
  

  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#FFFFFF', dark: '#000000' }}
          headerImage={
            <View style = {styles.headerContainer}>
              <Image
                source={require('@/assets/icons/LongTasteBaseLogo.png')}
                style={styles.Logo}
              />
            </View>
          }>
      <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.header}>Pantry</ThemedText>
          <AddIngredientButton onPress={() => setShowAdd(true)} />
          <AddIngredientModal
          visible={showAdd}
          onClose={() => setShowAdd(false)}
          onAdd={ handleAdd }
          />
          <ThemedText style={styles.subtitle}>All your ingredients, at a glance.</ThemedText>
          <IngredientList/>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 20,
    textAlign: 'center',
  },
  subtitle: {
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center',
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