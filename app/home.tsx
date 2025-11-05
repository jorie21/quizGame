import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { username } = useGame();
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

          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                // Add leaderboard navigation when available
              }}
              style={styles.secondaryBtnWrapper}
            >
              <View style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnIcon}>🏆</Text>
                <Text style={styles.secondaryBtnText}>Leaderboard</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                // Add stats navigation when available
              }}
              style={styles.secondaryBtnWrapper}
            >
              <View style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnIcon}>📊</Text>
                <Text style={styles.secondaryBtnText}>My Stats</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.replace("/")}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>← Log Out</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.08,
  },
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
  avatarContainer: {
    marginBottom: 20,
  },
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
  avatarText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
  },
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
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonsContainer: {
    width: "100%",
    marginBottom: 20,
  },
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
  primaryBtn: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  btnTextContainer: {
    flex: 1,
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  btnSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  secondaryBtnWrapper: {
    flex: 1,
  },
  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  secondaryBtnIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  secondaryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  logoutBtn: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  logoutText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
    fontWeight: "600",
  },
});