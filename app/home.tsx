import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";
import { clearAllProgress } from "../utils/storage"; // ✅ import the fixed storage clear helper

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { username, resetAll } = useGame();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [floatAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 🧹 Handle reset all progress (clears AsyncStorage + in-memory)
  const handleReset = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to clear all saved data and start fresh?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllProgress(); // ✅ remove AsyncStorage keys
              await resetAll(); // ✅ clear GameContext state
              router.replace("/"); // ✅ go back to username entry screen
              console.log("✅ Data cleared and app reset");
            } catch (err) {
              console.error("Error clearing progress:", err);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      {/* Animated decorative elements */}
      <Animated.View
        style={[
          styles.decorCircle,
          styles.decorCircle1,
          { transform: [{ translateY: floatAnim }] },
        ]}
      />
      <Animated.View
        style={[
          styles.decorCircle,
          styles.decorCircle2,
          { transform: [{ translateY: floatAnim }] },
        ]}
      />
      <Animated.View
        style={[
          styles.decorCircle,
          styles.decorCircle3,
          { transform: [{ translateY: floatAnim }] },
        ]}
      />

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* User greeting card */}
        <View style={styles.greetingCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {username.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.username}>{username}!</Text>
          <Text style={styles.subtitle}>Ready to test your knowledge? 🧠</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonsContainer}>
          {/* Start Quiz */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/topic-select")}
            style={styles.btnWrapper}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <View style={styles.btnContent}>
                <Text style={styles.btnIcon}>🎯</Text>
                <View style={styles.btnTextContainer}>
                  <Text style={styles.btnText}>START QUIZ</Text>
                  <Text style={styles.btnSubtext}>Begin your challenge</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Reset Progress */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleReset}
            style={styles.btnWrapper}
          >
            <LinearGradient
              colors={["#444", "#222"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <View style={styles.btnContent}>
                <Text style={styles.btnIcon}>🧹</Text>
                <View style={styles.btnTextContainer}>
                  <Text style={styles.btnText}>RESET PROGRESS</Text>
                  <Text style={styles.btnSubtext}>Clear all saved data</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  decorCircle: { position: "absolute", borderRadius: 9999, opacity: 0.08 },
  decorCircle1: {
    width: 250,
    height: 250,
    backgroundColor: colors.primary,
    top: -50,
    right: -50,
  },
  decorCircle2: {
    width: 180,
    height: 180,
    backgroundColor: colors.secondary,
    bottom: 100,
    left: -30,
  },
  decorCircle3: {
    width: 150,
    height: 150,
    backgroundColor: colors.primary,
    top: "40%",
    right: -40,
  },
  greetingCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatarContainer: { marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  avatarText: { fontSize: 36, fontWeight: "900", color: "#fff" },
  welcome: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
  username: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
    textShadowColor: colors.primary,
    textShadowRadius: 15,
  },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 16, fontWeight: "500" },
  buttonsContainer: { width: "100%", marginBottom: 20 },
  btnWrapper: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: colors.secondary,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  primaryBtn: { paddingVertical: 20, paddingHorizontal: 25 },
  btnContent: { flexDirection: "row", alignItems: "center" },
  btnIcon: { fontSize: 32, marginRight: 15 },
  btnTextContainer: { flex: 1 },
  btnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  btnSubtext: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "500" },
});
