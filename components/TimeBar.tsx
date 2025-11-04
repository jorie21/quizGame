import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import colors from "../theme/colors";

interface TimerBarProps {
  duration: number; // seconds
  onTimeUp: () => void;
  trigger?: number; // optional key to reset timer externally
}

export default function TimerBar({ duration, onTimeUp, trigger }: TimerBarProps) {
  const progress = useRef(new Animated.Value(1)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // stop any running animation
    if (animation.current) animation.current.stop();

    // reset bar instantly
    progress.setValue(1);

    // start new countdown
    animation.current = Animated.timing(progress, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false,
    });

    animation.current.start(({ finished }) => {
      if (finished) onTimeUp();
    });

    return () => {
      if (animation.current) animation.current.stop();
    };
  }, [trigger]); // reset whenever trigger changes

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
  },
  bar: {
    height: "100%",
    backgroundColor: colors.secondary,
  },
});
