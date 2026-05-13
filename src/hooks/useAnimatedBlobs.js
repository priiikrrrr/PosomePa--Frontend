import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

export default function useAnimatedBlobs(count = 3) {
  const refs = useRef([]);
  if (refs.current.length === 0) {
    refs.current = Array.from({ length: count }, () => new Animated.Value(0));
  }

  useEffect(() => {
    const roundTrip = (anim, duration, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

    const durations = [4000, 5000, 6000];
    const delays = [0, 500, 1000];

    const anims = refs.current.map((ref, i) =>
      roundTrip(ref, durations[i] || 4000, delays[i] || 0),
    );
    anims.forEach((a) => a.start());

    return () => {
      refs.current.forEach((ref) => ref.stopAnimation());
    };
  }, []);

  return refs.current;
}
