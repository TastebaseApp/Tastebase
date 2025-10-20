import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type ParseResult = { added: number; skipped: string[] };

export async function parseAndAddItems(
  raw: string,
  addItem: (amt: number, unit: string, name: string) => Promise<void>
): Promise<ParseResult> {
  const skipped: string[] = [];
  let added = 0;

  const entries = raw.split(",").map(s => s.trim()).filter(Boolean);

  for (const entry of entries) {
    const parts = entry.split(/\s+/).filter(Boolean);

    if (parts.length < 3 || isNaN(Number(parts[0]))) {
      skipped.push(entry); // Reject input if not in "qty unit name" format
      continue;
    }

    const amt = Number(parts[0]);
    const unit = parts[1];
    const name = parts.slice(2).join(' ');

    await addItem(amt, unit, name);
    added++;
  }

  return { added, skipped };
}

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (raw: string) => Promise<ParseResult>;
};

export function AddIngredientModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  // Validate input format before sending to onAdd
const handleSubmit = async () => {
  if (!name.trim()) {
    setError("Input cannot be empty");
    return;
  }

  const testParts = name.trim().split(/\s+/);
  if (testParts.length < 3 || isNaN(Number(testParts[0]))) {
    setError("❗ Format must be: quantity unit name (e.g., 1 tbsp sugar)");
    return;
  }

  try {
    const result = await onAdd(name);
    if (result.skipped.length > 0) {
      setError(`Skipped ${result.skipped.length} invalid item(s)`);
    } else {
      setName('');
      setError('');
      onClose();
    }
  } catch (e: any) {
    setError(e.message || 'An error occurred');
  }
};



  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: bg }]}>

          <ThemedText type="title" style={styles.title}>
            Add Ingredient
          </ThemedText>

          <ThemedText style={styles.instructions}>
            Format: quantity unit name {"\n"}Example: 1 tbsp sugar
          </ThemedText>

          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError('');
            }}
            placeholder="e.g., 1 tbsp sugar"
            placeholderTextColor={text + '88'}
            style={[
              styles.input,
              { color: text, borderColor: text + '33' },
            ]}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          {/* Error Message */}
          {error ? (
            <ThemedText style={styles.error}>
              {error}
            </ThemedText>
          ) : null}

          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
              <ThemedText style={{ fontWeight: '600' }}>Add</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  instructions: {
    fontSize: 14,
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 14,
    marginTop: -4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
  },
});
