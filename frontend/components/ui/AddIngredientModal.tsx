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
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (items: SubmitRow[]) => Promise<void>;
};

type SubmitRow = { amount: number; unit: string; name: string };

export function AddIngredientModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");

  type Row = { id: string; amount: string; unit: string; name: string };
  const uid = () => Math.random().toString(36).slice(2, 9);

  const [rows, setRows] = useState<Row[]>([
    { id: uid(), amount: "", unit: "", name: "" },
  ]);

  const addRow = () =>
    setRows((r) => [...r, { id: uid(), amount: "", unit: "", name: "" }]);

  const updateRow = (id: string, key: keyof Row) => (val: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: val } : x)));

  const removeRow = (id: string) =>
    setRows((r) => (r.length === 1 ? r : r.filter((x) => x.id !== id)));

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");

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
                <View key={r.id} style={styles.rowInputs}>
                  <TouchableOpacity
                    onPress={() => removeRow(r.id)}
                    style={styles.iconBtn}
                    hitSlop={8}
                  >
                    <Image
                      source={require("@/assets/icons/Minus circle.png")}
                      style={{
                        height: 28,
                        width: 28,
                        resizeMode: "contain",
                        justifyContent: "center",
                      }}
                    />
                  </TouchableOpacity>
                  <View style={styles.inputGroup}>
                    <ThemedText>Amount</ThemedText>
                    <TextInput
                      value={r.amount}
                      onChangeText={updateRow(r.id, "amount")}
                      keyboardType="numeric"
                      placeholder="1"
                      placeholderTextColor={"rgba(0,0,0,0.55)"}
                      cursorColor={text}
                      selectionColor={"rgba(0,0,0,0.25)"}
                      style={[
                        styles.input,
                        { color: text, borderColor: "rgba(0,0,0,0.2)" },
                      ]}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <ThemedText>Unit</ThemedText>
                    <TextInput
                      value={r.unit}
                      onChangeText={updateRow(r.id, "unit")}
                      placeholder="cup"
                      placeholderTextColor={"rgba(0,0,0,0.55)"}
                      cursorColor={text}
                      selectionColor={"rgba(0,0,0,0.25)"}
                      style={[
                        styles.input,
                        { color: text, borderColor: "rgba(0,0,0,0.2)" },
                      ]}
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 2 }]}>
                    <ThemedText>Name</ThemedText>
                    <TextInput
                      value={r.name}
                      onChangeText={updateRow(r.id, "name")}
                      placeholder="e.g., Sugar"
                      placeholderTextColor={"rgba(0,0,0,0.55)"}
                      cursorColor={text}
                      selectionColor={"rgba(0,0,0,0.25)"}
                      style={[
                        styles.input,
                        { color: text, borderColor: "rgba(0,0,0,0.2)" },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={addRow}
            style={styles.plusBox}
            activeOpacity={0.85}
          >
            <AntDesign name="plus" size={24} color={text + "99"} />
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
                    const amt =
                      Number.isFinite(amtNum) && amtNum > 0 ? amtNum : 1;
                    const unitStr = r.unit.trim();
                    const nameStr = r.name.trim().replace(/\s+/g, " ");
                    return { amount: amt, unit: unitStr, name: nameStr };
                  });

                if (!items.length) {
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
    borderColor: "rgba(0,0,0,0.15)", // or text + '33' if you prefer
    marginBottom: 12,
  },
});
