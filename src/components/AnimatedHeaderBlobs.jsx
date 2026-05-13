import React from "react";
import { Animated, StyleSheet } from "react-native";
import useAnimatedBlobs from "../hooks/useAnimatedBlobs";

export default function AnimatedHeaderBlobs() {
  const [b1, b2, b3] = useAnimatedBlobs(3);

  const b1Y = b1.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] });
  const b1X = b1.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] });
  const b2Y = b2.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] });
  const b2X = b2.interpolate({ inputRange: [0, 1], outputRange: [15, -15] });
  const b3Y = b3.interpolate({ inputRange: [0, 1], outputRange: [-15, 15] });
  const b3X = b3.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] });

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob1,
          { transform: [{ translateY: b1Y }, { translateX: b1X }] },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob2,
          { transform: [{ translateY: b2Y }, { translateX: b2X }] },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob3,
          { transform: [{ translateY: b3Y }, { translateX: b3X }] },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  blob1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -120,
    right: -50,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
  },
  blob2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -30,
    left: -60,
    backgroundColor: "rgba(13, 148, 136, 0.18)",
  },
  blob3: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    top: 10,
    left: "30%",
    backgroundColor: "rgba(196, 181, 253, 0.38)",
  },
});
