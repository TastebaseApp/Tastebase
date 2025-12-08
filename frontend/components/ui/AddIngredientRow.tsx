import { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import pantryService from "@/services/pantryService";
import { Palette } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";

type IngredientOption = {
  id: string;
  name: string;
  imageUrl?: string;
  possibleUnits: string[];
  image: string;
};

type Row = {
  id: number;
  amount: string;
  unit: string;
  name: string;
  itemID?: string;
  image: string;
};

type RowProps = {
  row: Row;
  textColor: string;
  iconColor: string;
  // value is string because that's what TextInput and suggestion ids provide; modal will coerce to number if needed
  onChange: (id: number, key: keyof Row, value: string) => void;
  onRemove: (id: number) => void;
};

export function AddIngredientRow({
  row,
  textColor,
  iconColor,
  onChange,
  onRemove,
}: RowProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<IngredientOption[]>([]);
  const [loading, setLoading] = useState(false);

  // units for this specific row
  const [units, setUnits] = useState<string[]>(row.unit ? [row.unit] : []);

  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);

  const handleSubmitEditing = async () => {
    const query = row.name.trim();
    if (!query) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const results = await pantryService.searchIngredient(query, 10);

      const mapped: IngredientOption[] = results.map((ing) => ({
        id: String(ing.itemID),
        name: ing.itemName,
        imageUrl: ing.image
          ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`
          : undefined,
        image: ing.image,
        // adjust this field name to whatever your backend uses:
        possibleUnits: ing.possibleUnits ?? [],
      }));

      setSuggestions(mapped);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Ingredient search failed:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowSuggestions =
    showSuggestions && (loading || suggestions.length > 0);
  const unitDisabled = units.length === 0 && !row.unit;

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.rowInputs}>
        <TouchableOpacity
          onPress={() => onRemove(row.id)}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Image
            source={require("@/assets/icons/Minus circle.png")}
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmitEditing}
          style={{ padding: 3, marginTop: 24 }}
        >
          <AntDesign name="search" size={24} color={Palette.grey} />
        </TouchableOpacity>

        {/* Name */}
        <View style={[styles.inputGroup, { flex: 2 }]}>
          <ThemedText>Name</ThemedText>
          <TextInput
            value={row.name}
            onChangeText={(val) => {
              onChange(row.id, "name", val);
              setShowSuggestions(false);
              // clear units and selected item if they change the name
              setUnits([]);
              setUnitDropdownOpen(false);
              onChange(row.id, "unit", "");
              onChange(row.id, "itemID", "");
              handleSubmitEditing();
            }}
            placeholder="e.g., Sugar"
            placeholderTextColor={iconColor}
            cursorColor={textColor}
            selectionColor={iconColor}
            style={[styles.input, { color: textColor, borderColor: iconColor }]}
            onSubmitEditing={handleSubmitEditing}
          />
        </View>

        {/* Unit dropdown */}
        <View style={[styles.inputGroup, { flexWrap: "nowrap" }]}>
          <ThemedText>Unit</ThemedText>

          <TouchableOpacity
            onPress={() => !unitDisabled && setUnitDropdownOpen((o) => !o)}
            style={[
              styles.input,
              {
                borderColor: iconColor,
                backgroundColor: unitDisabled
                  ? Palette.lightGrey
                  : "transparent",
                opacity: unitDisabled ? 0.6 : 1,
                justifyContent: "center",
              },
            ]}
          >
            <ThemedText
              style={{ color: textColor }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {row.unit || (unitDisabled ? "-" : "-")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.inputGroup}>
          <ThemedText>Amount</ThemedText>
          <TextInput
            value={row.amount}
            onChangeText={(val) => onChange(row.id, "amount", val)}
            keyboardType="numeric"
            placeholder="1"
            placeholderTextColor={iconColor}
            cursorColor={textColor}
            selectionColor={iconColor}
            style={[styles.input, { color: textColor, borderColor: iconColor }]}
          />
        </View>
      </View>

      {/* DROPDOWN HERE */}
      {unitDropdownOpen && units.length > 0 && (
        <View style={styles.unitDropdownContainer}>
          <ScrollView style={{ maxHeight: 150 }}>
            {units.map((u) => (
              <TouchableOpacity
                key={u}
                style={styles.unitRow}
                onPress={() => {
                  onChange(row.id, "unit", u);
                  setUnitDropdownOpen(false);
                }}
              >
                <ThemedText>{u}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ingredient suggestions */}
      {shouldShowSuggestions && (
        <View style={styles.suggestionsContainer}>
          {loading ? (
            <ActivityIndicator style={{ padding: 8 }} />
          ) : (
            <ScrollView
              style={{ maxHeight: 150 }}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {suggestions.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.suggestionRow}
                  onPress={() => {
                    // set name
                    onChange(row.id, "name", opt.name);
                    setShowSuggestions(false);

                    // set possible units for this row
                    setUnits(opt.possibleUnits ?? []);
                    setUnitDropdownOpen(false);

                    // set the chosen ingredient id so the modal can submit it
                    onChange(row.id, "itemID", opt.id);
                    onChange(row.id, "image", opt.image)

                    // optionally auto-select first unit
                    if (opt.possibleUnits && opt.possibleUnits.length > 0) {
                      onChange(row.id, "unit", opt.possibleUnits[0]);
                    }
                  }}
                >
                  {opt.imageUrl && (
                    <Image
                      source={{ uri: opt.imageUrl }}
                      style={styles.suggestionImage}
                    />
                  )}
                  <ThemedText>{opt.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: 10,
    marginBottom: 4,
  },
  inputGroup: {
    flex: 1,
  },
  iconBtn: {
    width: 34,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionsContainer: {
    marginLeft: 44,
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.grey,
    overflow: "hidden",
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.grey,
  },
  suggestionImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginRight: 8,
  },
  unitDropdownContainer: {
    marginLeft: 44,
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.grey,
    overflow: "hidden",
  },
  unitRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.grey,
  },
});
