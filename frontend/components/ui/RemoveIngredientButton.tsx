import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Image,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { usePantry } from "@/context/PantryContext";
import { addIngredientQuantity } from "./AddIngredientButton";
import { useEffect } from "react";

type Props = {
  itemID: number;
  currentAmount: number;
  unit: string;
  ingredientName: string;
};

export default function RemoveIngredientButton({
  itemID,
  currentAmount,
  unit,
  ingredientName,
}: Props) {
  const { removeIngredient, addIngredient, reduceIngredient } = usePantry();
  const [val, setVal] = useState(currentAmount.toString());
  const iconColor = useThemeColor({}, "text");

  useEffect(() => {
    setVal(currentAmount.toString());
  }, [currentAmount]);

  const onMinus = async (e?: any) => {
    try {
      await reduceIngredient(itemID, 1);
    } catch (error) {
      // Optionally show error to user
    }
  };

  const onPlus = async (e?: any) => {
    try {
      // need add amount of ingredient here
    } catch (error) {
      // Optionally show error to user
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={onMinus} activeOpacity={0.7}>
          <Image
            source={require("@/assets/icons/Minus circle.png")}
            style={styles.adjustIcon}
          />
        </TouchableOpacity>
        <TextInput
          value={val}
          onChangeText={setVal}
          placeholderTextColor={iconColor}
          keyboardType="numeric"
          style={[
            styles.input,
            { color: iconColor, borderColor: iconColor + "33" },
          ]}
        />
        <TouchableOpacity onPress={onPlus} activeOpacity={0.7}>
          <Image
            source={require("@/assets/icons/Plus circle.png")}
            style={styles.adjustIcon}
          />
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.total}>{unit}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  input: {
    width: 50,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 6,
  },
  adjustIcon: {
    resizeMode: "contain",
    width: 24,
    height: 24,
  },
  adjustButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  minusText: {
    fontWeight: "700",
    fontSize: 14,
  },
  plusText: {
    fontWeight: "700",
    fontSize: 14,
  },
  total: {
    fontSize: 12,
    textAlign: "center",
  },
});