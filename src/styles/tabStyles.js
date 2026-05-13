import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const categoryGridStyles = StyleSheet.create({
  outer: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 12,
  },
  page: { paddingHorizontal: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  item: {
    alignItems: "center",
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    width: (SCREEN_WIDTH - 56) / 4,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  label: { fontSize: 10, fontWeight: "700", textAlign: "center" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    marginBottom: 4,
  },
  dot: { height: 5, borderRadius: 2.5 },
});

export const sectionHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  sub: { fontSize: 12, marginTop: 2 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  actionText: { fontSize: 12, fontWeight: "600" },
});

export const statBadgeStyles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    flex: 1,
    justifyContent: "center",
  },
  badgeBg: { ...StyleSheet.absoluteFillObject },
  value: { fontSize: 12, fontWeight: "800", letterSpacing: -0.3 },
  label: { fontSize: 10, color: "#94A3B8", fontWeight: "500" },
});

export const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: { borderColor: "#8B5CF620" },
  text: { fontSize: 11, fontWeight: "600" },
});
