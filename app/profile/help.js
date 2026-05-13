import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/context/ThemeContext";
import PageHeader from "../../src/components/PageHeader";
import {
  useThemeColors,
  spacing,
  borderRadius,
} from "../../src/utils/theme";

export default function HelpSupportScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = useThemeColors();

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Error", "Unable to open email app");
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <PageHeader
        title="Help & Support"
        showBack={true}
        onBack={() => router.back()}
        variant="simple"
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro about PosomePa - at top */}
        <View
          style={[
            styles.introCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.introTitle, { color: colors.primary }]}>
            Welcome to PosomePa
          </Text>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            PosomePa is your trusted platform for booking premium event spaces,
            banquet halls, party venues, and more. We connect hosts with guests
            seeking quality spaces for celebrations, meetings, and events.
          </Text>
          <Text
            style={[
              styles.introText,
              { color: colors.textSecondary, marginTop: spacing.sm },
            ]}
          >
            Our dedicated support team is here to help you with any queries or
            issues.
          </Text>
        </View>

        {/* Ticket-based Support Header */}
        <View
          style={[
            styles.headerCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Ionicons name="headset" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Ticket-Based Support
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Raise a ticket for any issues with necessary proofs. Our team will
            address your concerns within 7 working days.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Raise a Ticket
        </Text>

        <TouchableOpacity
          style={[
            styles.ticketCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => handleEmailPress("posomepaticket@gmail.com")}
        >
          <View
            style={[
              styles.ticketIcon,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Ionicons name="mail" size={22} color={colors.primary} />
          </View>
          <View style={styles.ticketInfo}>
            <Text style={[styles.ticketTitle, { color: colors.textPrimary }]}>
              General Issues
            </Text>
            <Text style={[styles.ticketEmail, { color: colors.primary }]}>
              posomepaticket@gmail.com
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.ticketCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => handleEmailPress("posomepapayIssue@gmail.com")}
        >
          <View
            style={[
              styles.ticketIcon,
              { backgroundColor: colors.success + "15" },
            ]}
          >
            <Ionicons name="card" size={22} color={colors.success} />
          </View>
          <View style={styles.ticketInfo}>
            <Text style={[styles.ticketTitle, { color: colors.textPrimary }]}>
              Payment Issues
            </Text>
            <Text style={[styles.ticketEmail, { color: colors.primary }]}>
              posomepapayIssue@gmail.com
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: isDark ? colors.gray800 : colors.gray100 },
          ]}
        >
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.warning} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Response within 7 working days
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={colors.error}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Include "URGENT" for urgent matters
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  headerCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", marginBottom: spacing.xs },
  headerSubtitle: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  introCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  introTitle: { fontSize: 18, fontWeight: "700", marginBottom: spacing.sm },
  introText: { fontSize: 13, lineHeight: 19 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: spacing.md },
  ticketCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  ticketIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketInfo: { flex: 1, marginLeft: spacing.md },
  ticketTitle: { fontSize: 15, fontWeight: "600" },
  ticketEmail: { fontSize: 13, marginTop: 2 },
  infoCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  infoText: { fontSize: 13 },
});
