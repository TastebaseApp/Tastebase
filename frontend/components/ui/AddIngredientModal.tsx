import { PropsWithChildren, useState } from 'react';
import { Modal, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ParseResult = { added: number; skipped: string[] };

export async function parseAndAddItems(raw: string, addItem: (amt: number, unit: string, name:string) => Promise<void>): Promise<ParseResult>{
  const skipped: string[] = [];
  let added = 0;

  const entries = raw.split(",").map(s=> s.trim()).filter(Boolean);

  for(const entry of entries){
    const parts = entry.split(/\s+/).filter(Boolean);

    if (parts.length < 1) { skipped.push(entry); continue; }

    let amt = 0;
    if (!Number.isFinite(amt)) { skipped.push(entry); continue; }

    let unit: string;
    let name: string;

    if (parts.length === 2) {
      unit = parts[1];
      name = parts[1];
      amt = Number(parts[0]);
    }else if(parts.length === 1){
      amt = 1;
      unit = parts[0];
      name = parts[0];
    } else {
      amt = Number(parts[0]);
      unit = parts[1];
      name = parts.slice(2).join(' ');
    }

    if (!name) { skipped.push(entry); continue; }

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
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: bg }]}>

          <ThemedText type="title" style={styles.title}>
            Add Ingredient
          </ThemedText>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Apple"
            placeholderTextColor={text + '88'}
            style={[
              styles.input,
              { color: text, borderColor: text + '33' },
            ]}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => onAdd(name)}
          />

          <View style={styles.row}>

            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn} onPress={() => onAdd(name)}>
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
  title: { marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
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