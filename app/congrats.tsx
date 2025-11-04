import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";

export default function CongratsScreen() {
  const router = useRouter();
  const { username, score, resetAll } = useGame();
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        🎉 CONGRATULATIONS! 🎉
      </Animated.Text>

      <Text style={styles.name}>{username}</Text>
      <Text style={styles.text}>You’ve completed all stages!</Text>

      <Text style={styles.finalScore}>Total Score: {score}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          resetAll();
          router.replace("/");
        }}
      >
        <Text style={styles.btnText}>Play Again 🔁</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: colors.text,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 30,
  },
  finalScore: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: "900",
    marginBottom: 40,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
