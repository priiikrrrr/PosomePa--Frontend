import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { statBadgeStyles as s } from "../styles/tabStyles";

function StatBadge({ icon, label, value, accent }) {
  const labelLength = label.length;
  let paddingH = 8;
  if (labelLength > 12) paddingH = 14;
  else if (labelLength > 8) paddingH = 12;
  else if (labelLength > 5) paddingH = 10;

  return (
    <View style={[s.badge, { borderColor: accent + "30", paddingHorizontal: paddingH }]}>
      <LinearGradient
        colors={[accent + "18", accent + "06"]}
        style={s.badgeBg}
      />
      <Ionicons name={icon} size={14} color={accent} />
      <Text style={[s.value, { color: accent }]}>{value}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

export default StatBadge;
