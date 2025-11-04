import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";

export default function StageSelect() {
  const router = useRouter();
  const { stage, setStage } = useGame();

  const handleStageSelect = (s: number) => {
    setStage(s);
    router.push("/quiz");
  };

  const handleBackToTopics = () => {
    router.replace("/topic-select");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CHOOSE YOUR STAGE 🚀</Text>

      {Array.from({ length: 5 }, (_, i) => (
        <TouchableOpacity
          key={i}
          style={styles.stageBtn}
          onPress={() => handleStageSelect(i + 1)}
        >
          <Text style={styles.stageText}>STAGE {i + 1}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.backBtn} onPress={handleBackToTopics}>
        <Text style={styles.backText}>← Back to Topics</Text>
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
  header: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  stageBtn: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: "70%",
    paddingVertical: 16,
    marginVertical: 10,
    alignItems: "center",
  },
  stageText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  backBtn: {
    marginTop: 40,
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
