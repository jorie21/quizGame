import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";
import { getUsername, saveUsername } from "../utils/storage";

const { width } = Dimensions.get("window");

export default function IndexScreen() {
  const router = useRouter();
  const { setUsername } = useGame();
  const [name, setName] = useState("");
  const [focusAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [floatAnim] = useState(new Animated.Value(0));

  // ✅ Auto-redirect if username already saved
  useEffect(() => {
    (async () => {
      const saved = await getUsername();
      if (saved) {
        setUsername(saved);
        router.replace("/home");
      }
    })();
  }, []);

  // ✨ Animations
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ✅ Save username permanently and move to home
  const handleStart = async () => {
    if (!name.trim()) return;
    await saveUsername(name.trim());
    setUsername(name.trim());
    router.replace("/home");
  };

  const handleFocus = () => {
    Animated.spring(focusAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(focusAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.1)", colors.secondary],
  });

  const inputScale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Animated background */}
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

        {/* Title */}
        <Animated.View
          style={[styles.titleContainer, { transform: [{ scale: pulseAnim }] }]}
        >
          <Text style={styles.titleEmoji}>⚡</Text>
          <Text style={styles.title}>QUIZ ARENA</Text>
          <Text style={styles.titleEmoji}>⚡</Text>
        </Animated.View>

        <Text style={styles.subtitle}>Test Your Knowledge. Claim Victory.</Text>

        {/* Username input */}
        <Animated.View
          style={[
            styles.inputContainer,
            { borderColor, transform: [{ scale: inputScale }] },
          ]}
        >
          <View style={styles.inputIcon}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your username"
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={20}
          />
        </Animated.View>

        {/* Start button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleStart}
          style={styles.btnWrapper}
          disabled={!name.trim()}
        >
          <LinearGradient
            colors={
              name.trim()
                ? [colors.primary, colors.secondary, colors.primary]
                : ["#444", "#333", "#444"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>START GAME</Text>
            <Text style={styles.btnArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats footer */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Fun</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 100,
    opacity: 0.1,
  },
  decorCircle1: {
    width: 200,
    height: 200,
    backgroundColor: colors.primary,
    top: 50,
    right: -50,
  },
  decorCircle2: {
    width: 150,
    height: 150,
    backgroundColor: colors.secondary,
    bottom: 100,
    left: -50,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  titleEmoji: { fontSize: 32, marginHorizontal: 8 },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: colors.primary,
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 50,
    fontWeight: "500",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 2,
    borderRadius: 16,
    marginBottom: 25,
    overflow: "hidden",
  },
  inputIcon: { paddingLeft: 18, paddingRight: 10 },
  iconText: { fontSize: 20 },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 16,
    paddingRight: 18,
    fontSize: 16,
    fontWeight: "500",
  },
  btnWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.secondary,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    marginBottom: 40,
  },
  btn: {
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginRight: 8,
  },
  btnArrow: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
