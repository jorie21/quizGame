import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";

export default function ResultScreen() {
  const router = useRouter();
  const { score, stage, resetStage, resetAll } = useGame();

  const handleNext = () => {
    if (stage < 5) {
      resetStage();
      router.replace("/stage-select");
    } else {
      router.replace("/congrats");
    }
  };

  const handleRestart = () => {
    resetAll();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stage {stage} Complete 🎯</Text>
      <Text style={styles.scoreText}>Your Score</Text>
      <Text style={styles.score}>{score}</Text>

      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>{stage < 5 ? "Next Stage ➡️" : "Finish Game 🏆"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.restart]} onPress={handleRestart}>
        <Text style={styles.btnText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: colors.secondary,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scoreText: { color: colors.muted, fontSize: 18 },
  score: {
    color: colors.text,
    fontSize: 64,
    fontWeight: "900",
    marginVertical: 20,
    textShadowColor: "#000",
    textShadowRadius: 10,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  restart: { backgroundColor: colors.secondary },
});
