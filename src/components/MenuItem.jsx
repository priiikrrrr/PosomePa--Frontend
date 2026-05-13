import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing, borderRadius } from "../utils/theme";

export default function MenuItem({ icon, label, description, onPress, color = "#8B5CF6", hasUnread, colors }) {
  return (
    <TouchableOpacity
      style={[miStyles.item, { backgroundColor: colors?.surface || "#fff" }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[miStyles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={miStyles.content}>
        <View style={miStyles.labelRow}>
          <Text style={[miStyles.label, { color: colors?.textPrimary || "#1E0A4A" }]}>{label}</Text>
          {hasUnread && <View style={miStyles.unreadDot} />}
        </View>
        <Text style={[miStyles.description, { color: colors?.textSecondary || "#6B7280" }]}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors?.textLight || "#9CA3AF"} />
    </TouchableOpacity>
  );
}

const miStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139,92,246,0.07)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, marginLeft: spacing.lg },
  labelRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  label: { fontSize: 16, fontWeight: "600" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" },
  description: { fontSize: 13, marginTop: 2 },
});
