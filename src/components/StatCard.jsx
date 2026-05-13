import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { spacing, borderRadius, shadows } from "../utils/theme";

export default function StatCard({ icon, label, value, sublabel, gradientColors, color, colors }) {
  const content = (
    <>
      <View style={st.iconContainer}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text style={st.label}>{label}</Text>
      <Text style={st.value}>{value}</Text>
      <Text style={st.sublabel}>{sublabel}</Text>
    </>
  );

  if (gradientColors) {
    return (
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.card}>
        {content}
      </LinearGradient>
    );
  }

  return (
    <View style={[st.card, { backgroundColor: color || (colors?.primary || "#8B5CF6") }]}>
      {content}
    </View>
  );
}

const st = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  label: { fontSize: 12, fontWeight: "500", color: "#fff" },
  value: { fontSize: 22, fontWeight: "700", color: "#fff", marginTop: spacing.xs },
  sublabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
});
