import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { chipStyles as s } from "../styles/tabStyles";

function PremiumCategoryChip({ category, selected, onPress, colors }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        s.chip,
        { backgroundColor: selected ? colors.primary : colors.surfaceSecondary },
        selected && s.chipSelected,
      ]}
    >
      <Ionicons
        name={category.icon || "apps-outline"}
        size={13}
        color={selected ? "#fff" : category.color || colors.primary}
      />
      <Text
        style={[s.text, { color: selected ? "#fff" : colors.textSecondary }]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

export default PremiumCategoryChip;
