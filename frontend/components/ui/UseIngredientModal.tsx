import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { AddIngredientRow } from "./AddIngredientRow";
import { usePantry } from "@/context/PantryContext";
import { Palette } from "@/constants/theme";

type SourceIngredient = {
  itemID: number;
  itemName: string;
  amount: { amount: number; unit: string };

  originalAmount: number;
};

type Row = {
  id: number;
  itemID: number;
  originalAmount: number;
  useAmount: string;
  unit: string;
  name: string;
};

const uid = () => Date.now() + Math.random();

type Props = {
  visible: boolean;
  onClose: () => void;
  ingredients: SourceIngredient[];
};

export function UseIngredientModal({ visible, onClose, ingredients }: Props) {
  const { setIngredient } = usePantry();

  const [rows, setRows] = useState<Row[]>([]);
  const bg = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");

  // Load rows when modal opens
  useEffect(() => {
    if (!visible) return;

    const initial = ingredients.map((i) => ({
      id: uid(),
      itemID: i.itemID,
      originalAmount: i.originalAmount,
      unit: i.amount.unit,
      name: i.itemName,
      useAmount: String(i.amount.amount),
    }));

    setRows(initial);
  }, [visible, ingredients]);

  const updateRow = (id: number, key: string, value: any) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const addRow = () =>
  setRows((prev) => [
    ...prev,
    {
      id: uid(),
      itemID: 0,          // placeholder until a search result is picked
      originalAmount: 0,  // we don't know pantry amount yet
      unit: "",
      name: "",
      useAmount: "",
    },
  ]);


  const removeRow = (id: number) =>
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((r) => r.id !== id)
    );

  const handleConfirm = async () => {
  for (const row of rows) {
    if (!row.itemID || row.originalAmount <= 0) continue;

    const useNum = Number(row.useAmount);
    if (!Number.isFinite(useNum) || useNum <= 0) continue;

    const newAmount = row.originalAmount - useNum;

    try {
      await setIngredient(row.itemID, newAmount, row.unit);
    } catch (err) {
      console.warn("Failed to update ingredient:", err);
    }
  }

  onClose();
};


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: bg }]}>
          <ThemedText type="title" style={styles.title}>
            Use Ingredients
          </ThemedText>

          <ScrollView style={{ maxHeight: 480 }}>
            {rows.map((r) => (
              <AddIngredientRow
                key={r.id}
                row={{
                  id: r.id,
                  amount: r.useAmount,
                  unit: r.unit,
                  name: r.name,
                  itemID: String(r.itemID),
                }}
                textColor={textColor}
                iconColor={icon}
                onChange={(id, key: keyof Row | "amount", value) => {
                  if (key === "amount") key = "useAmount";
                  updateRow(id, key, value);
                }}
                onRemove={removeRow}
              />
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={addRow}
            style={styles.plusBox}
            activeOpacity={0.85}
          >
            <AntDesign name="plus" size={24} color={icon} />
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
              <ThemedText style={{ fontWeight: "600" }}>Confirm</ThemedText>
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
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "92%",
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  title: { marginBottom: 4 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 84,
    alignItems: "center",
  },
  plusBox: {
      height: 48,
      borderWidth: 1,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderColor: Palette.grey,
      marginBottom: 12,
  }
});
