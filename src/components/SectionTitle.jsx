import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SectionTitle({ title, colors }) {
  return (
    <View style={stStyles.row}>
      <View style={[stStyles.accent, { backgroundColor: colors.primary }]} />
      <Text style={[stStyles.text, { color: colors.textPrimary }]}>{title}</Text>
    </View>
  );
}

const stStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 22 },
  accent: { width: 3, height: 18, borderRadius: 2 },
  text: { fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
});
