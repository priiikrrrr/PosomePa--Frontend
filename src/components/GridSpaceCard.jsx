import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useLikedSpaces from "../hooks/useLikedSpaces";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function GridSpaceCard({ space, onPress, colors, imageBorderRadius = 16, overlayOpacity = 0.82 }) {
  const likeScaleAnim = useRef(new Animated.Value(1)).current;
  const { toggleLike, isLiked } = useLikedSpaces();
  const liked = isLiked(space._id);

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(space._id);

    Animated.sequence([
      Animated.spring(likeScaleAnim, {
        toValue: 1.5,
        useNativeDriver: true,
        tension: 120,
        friction: 3,
      }),
      Animated.spring(likeScaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        tension: 120,
        friction: 5,
      }),
      Animated.spring(likeScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 6,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        gsStyles.card,
        liked && gsStyles.cardLiked,
        { backgroundColor: colors.surface },
      ]}
    >
      <View style={gsStyles.imageBox}>
        {space.images?.[0] ? (
          <ImageBackground
            source={{ uri: space.images[0] }}
            style={gsStyles.image}
            imageStyle={{ borderRadius: imageBorderRadius }}
          >
            <LinearGradient
              colors={["transparent", `rgba(10,6,30,${overlayOpacity})`]}
              style={gsStyles.overlay}
            />
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={["#8B5CF640", "#8B5CF610"]}
            style={[
              gsStyles.image,
              {
                borderRadius: imageBorderRadius,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Ionicons name="home" size={24} color="#8B5CF6" />
          </LinearGradient>
        )}
        <TouchableOpacity
          onPress={handleLike}
          style={gsStyles.likeButton}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: likeScaleAnim }] }}>
            <View style={[gsStyles.likeRing, liked && gsStyles.likeRingActive]}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={16}
                color={liked ? "#EF4444" : "#fff"}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View style={gsStyles.info}>
        <Text
          style={[gsStyles.name, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {space.name}
        </Text>
        <Text
          style={[gsStyles.loc, { color: colors.textLight }]}
          numberOfLines={1}
        >
          {space.location?.city || "Premium"}
        </Text>
        <View style={gsStyles.priceRow}>
          <Text style={[gsStyles.price, { color: colors.primary }]}>
            ₹{space.pricePerHour || space.price || "—"}
          </Text>
          <Text style={[gsStyles.unit, { color: colors.textLight }]}>/hr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const gsStyles = StyleSheet.create({
  card: {
    width: (SCREEN_WIDTH - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
  },
  cardLiked: { borderWidth: 2, borderColor: "rgba(239,68,68,0.4)" },
  imageBox: { borderRadius: 14, overflow: "hidden", height: 130, margin: 6 },
  image: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, borderRadius: 14 },
  likeButton: { position: "absolute", bottom: 8, right: 8, zIndex: 10 },
  likeRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  likeRingActive: {
    borderWidth: 2,
    borderColor: "rgba(239,68,68,0.6)",
    backgroundColor: "rgba(239,68,68,0.25)",
  },
  ratingBubble: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingTxt: { color: "#F59E0B", fontSize: 9, fontWeight: "700" },
  info: { paddingHorizontal: 10, paddingBottom: 12, paddingTop: 4 },
  name: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  loc: { fontSize: 10, marginTop: 1 },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
    gap: 1,
  },
  price: { fontSize: 15, fontWeight: "800", letterSpacing: -0.5 },
  unit: { fontSize: 10 },
});

export default GridSpaceCard;
