import { PropsWithChildren, useState } from "react";
import {
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { Palette } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";
import { AddIngredientRow } from "./AddIngredientRow";
import { useEffect } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (items: SubmitRow[]) => Promise<void>;
};

type SubmitRow = { itemID?: number; amount: number; unit: string; name: string; image: string };

export function AddIngredientModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState("");

  type Row = { id: number; amount: string; unit: string; name: string; itemID?: string; image: string };
  const uid = () => Date.now() + Math.random();

  // initialize rows with a unique id so AddIngredientRow mounts fresh
  const [rows, setRows] = useState<Row[]>([{ id: uid(), amount: "", unit: "", name: "", itemID: undefined, image: ""}]);

  // When the modal is opened, reset rows to a single cleared row so stale
  // values from previous opens aren't shown.
  useEffect(() => {
    if (visible) {
      setRows([{ id: uid(), amount: "", unit: "", name: "", itemID: undefined, image: ""}]);
    }
  }, [visible]);

  const addRow = () =>
    setRows((r) => [...r, { id: uid(), amount: "", unit: "", name: "", image: ""}]);

  const updateRow = (id: number, key: keyof Row) => (val: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: val } : x)));

  const removeRow = (id: number) =>
    setRows((r) => (r.length === 1 ? r : r.filter((x) => x.id !== id)));

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: bg }]}>
          <ThemedText type="title" style={styles.title}>
            Add Ingredient
          </ThemedText>
          <ScrollView style={{ maxHeight: 480 }}>
            <View style={styles.rowsContainer}>
              {rows.map((r) => (
                <AddIngredientRow
                  key={r.id}
                  row={r}
                  textColor={text}
                  iconColor={icon}
                  onChange={(id, key, value) =>
                    setRows((prev) =>
                      prev.map((row) =>
                        row.id === id ? { ...row, [key]: value } : row
                      )
                    )
                  }
                  onRemove={removeRow}
                />
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={addRow}
            style={styles.plusBox}
            activeOpacity={0.85}
          >
            <AntDesign name="plus" size={24} color={icon} />
          </TouchableOpacity>
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                const items = rows
                  .filter((r) => r.name.trim().length)
                  .map((r) => {
                    const amtNum = Number(r.amount);
                    const amt = Number.isFinite(amtNum) && amtNum > 0 ? amtNum : 1;
                    const unitStr = r.unit.trim();
                    const nameStr = r.name.trim().replace(/\s+/g, " ");
                    const itemID = r.itemID !== undefined && r.itemID !== null ? Number(r.itemID) : undefined;
                    const image = r.image;
                    return {
                      itemID: itemID,
                      amount: amt,
                      unit: unitStr,
                      name: nameStr,
                      image: image
                    } as SubmitRow;
                  });

                if (!items.length) {
                  // nothing valid to add
                  return;
                }

                await onAdd(items); // pass structured rows directly
                onClose();
              }}
            >
              <ThemedText style={{ fontWeight: "600" }}>Add</ThemedText>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    width: "95%",
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
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 84,
  },
  rowInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  inputGroup: {
    flex: 1,
  },
  rowsContainer: {
    marginBottom: 10,
    gap: 10,
  },
  iconBtn: {
    width: 34,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  plusBox: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Palette.grey, // or text + '33' if you prefer
    marginBottom: 12,
  },
});
