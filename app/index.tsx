import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";

export default function IndexScreen() {
  const router = useRouter();
  const { setUsername } = useGame();
  const [name, setName] = useState("");

  const handleStart = () => {
    if (!name.trim()) return;
    setUsername(name.trim());
    router.replace("/home");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg1.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🎯 QUIZ ARENA</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter username"
          placeholderTextColor="#ccc"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleStart} style={styles.btn}>
          <Text style={styles.btnText}>START GAME</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.secondary,
    marginBottom: 40,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#1b1f24",
    color: colors.text,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 18,
    marginBottom: 25,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowColor: "#6C63FF",
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
