import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sectionHeaderStyles as s } from "../styles/tabStyles";

function SectionHeader({ title, subtitle, action, onAction, colors }) {
  return (
    <View style={s.row}>
      <View>
        <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[s.sub, { color: colors.textLight }]}>{subtitle}</Text>
        ) : null}
      </View>
      {action ? (
        <TouchableOpacity onPress={onAction} style={s.actionBtn}>
          <Text style={[s.actionText, { color: colors.primary }]}>
            {action}
          </Text>
          <Ionicons name="chevron-forward" size={12} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default SectionHeader;
