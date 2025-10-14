import { StyleSheet, Modal } from 'react-native';
import { useState } from 'react';

import { ThemedView as ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { AddIngredientButton } from '@/components/ui/AddIngredientButton';
import { AddIngredientModal } from '@/components/ui/AddIngredientModal';
import { parseAndAddItems } from '@/components/ui/AddIngredientModal';
import IngredientList from '@/components/ui/IngredientList';
import { usePantry } from '@/context/PantryContext';


export default function TabPantryScreen() {
  const [showAdd, setShowAdd] = useState(false);
  const { addItem } = usePantry();

  const handleAdd = async (raw: string) => {
    const result = await parseAndAddItems(raw, addItem);
    setShowAdd(false);
    return result;
  };

  return (
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
});