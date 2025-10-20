import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AddIngredientButton } from '@/components/ui/AddIngredientButton';
import { AddIngredientModal, parseAndAddItems } from '@/components/ui/AddIngredientModal';
import IngredientList from '@/components/ui/IngredientList';
import { usePantry } from '@/context/PantryContext';


// Main screen component for the Pantry tab
export default function TabPantryScreen() {
  const [showAdd, setShowAdd] = useState(false); // useState() Controls visibility
  const { addItem } = usePantry();

  // Wraps input parsing + pantry update
  const handleAdd = async (raw: string) => {
    const result = await parseAndAddItems(raw, addItem);
    setShowAdd(false);
    return result;
  };

  // Render the pantry screen UI
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

// Styling definitions
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