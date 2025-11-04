import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";

export default function HomeScreen() {
  const router = useRouter();
  const { username } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {username}!</Text>
      <Text style={styles.subtitle}>Choose your destiny 💡</Text>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/topic-select")}
      >
        <Text style={styles.btnText}>START QUIZ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.secondary }]}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.btnText}>LOG OUT</Text>
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
    padding: 20,
  },
  welcome: { color: colors.text, fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: colors.muted, fontSize: 16, marginBottom: 40 },
  btn: {
    width: "70%",
    borderRadius: 15,
    paddingVertical: 14,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
