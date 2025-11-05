import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
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

const { width, height } = Dimensions.get("window");

export default function CongratsScreen() {
  const router = useRouter();
  const { username, score, resetAll } = useGame();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const trophyBounce = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sparkleRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  // Fireworks/confetti particles
  const fireworkAnims = useRef(
    Array(16)
      .fill(0)
      .map(() => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
      }))
  ).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Trophy bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyBounce, {
          toValue: -20,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(trophyBounce, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
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

    // Sparkle rotation
    Animated.loop(
      Animated.timing(sparkleRotate, {
        toValue: 360,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Fireworks explosion
    fireworkAnims.forEach((anim, index) => {
      const angle = (index / fireworkAnims.length) * Math.PI * 2;
      const distance = 150 + Math.random() * 50;
      const xTarget = Math.cos(angle) * distance;
      const yTarget = Math.sin(angle) * distance;
      const delay = 400 + index * 50;

      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim.x, {
              toValue: xTarget,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(anim.y, {
              toValue: yTarget,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 0.5,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(1000),
        ])
      ).start();

      // Reset position
      anim.x.setValue(0);
      anim.y.setValue(0);
    });

    // Button entrance
    setTimeout(() => {
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 600);
  }, []);

  const totalPossible = 100; // 5 stages × 20 questions
  const percentage = (score / totalPossible) * 100;
  const performanceLevel =
    percentage >= 90
      ? { emoji: "🏆", text: "LEGENDARY!", color: "#fbbf24" }
      : percentage >= 80
      ? { emoji: "🔥", text: "AMAZING!", color: colors.secondary }
      : percentage >= 70
      ? { emoji: "⭐", text: "EXCELLENT!", color: "#10b981" }
      : { emoji: "💪", text: "GREAT JOB!", color: colors.primary };

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

      {/* Rotating sparkles */}
      <Animated.View
        style={[
          styles.sparkleContainer,
          {
            transform: [
              {
                rotate: sparkleRotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[styles.sparkle, styles.sparkle1]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle2]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle3]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle4]}>✨</Text>
      </Animated.View>

      {/* Fireworks particles */}
     {fireworkAnims.map((anim, index) => {
      const fireworkColors: string[] = [
        "#fbbf24",
        "#10b981",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        colors.primary,
        colors.secondary,
      ];
      const color = fireworkColors[index % fireworkColors.length];


        return (   
          <Animated.View
            key={index}
            style={[
              styles.firework,
              {
                backgroundColor: color,
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.x },
                  { translateY: anim.y },
                  { scale: anim.scale },
                ],
              },
            ]}
          />
        );
      })}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Trophy with bounce */}
        <Animated.View
          style={[
            styles.trophyContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: trophyBounce }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(251, 191, 36, 0.2)", "rgba(251, 191, 36, 0.05)"]}
            style={styles.trophyGlow}
          >
            <Text style={styles.trophyEmoji}>🏆</Text>
          </LinearGradient>
        </Animated.View>

        {/* Congratulations title */}
        <Animated.View
          style={[
            styles.titleContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.title}>CONGRATULATIONS!</Text>
          <View style={styles.titleUnderline}>
            <LinearGradient
              colors={[colors.primary, colors.secondary, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.underlineGradient}
            />
          </View>
        </Animated.View>

        {/* Username highlight */}
        <Animated.View
          style={[
            styles.usernameContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.usernameLabel}>Champion</Text>
          <LinearGradient
            colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
            style={styles.usernameBadge}
          >
            <Text style={styles.username}>{username}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Achievement message */}
        <Text style={styles.achievementText}>
          You&apos;ve conquered all 5 stages!
        </Text>

        {/* Score card */}
        <Animated.View
          style={[
            styles.scoreCard,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
            style={styles.scoreCardGradient}
          >
            <Text
              style={[
                styles.performanceEmoji,
                { color: performanceLevel.color },
              ]}
            >
              {performanceLevel.emoji}
            </Text>
            <Text
              style={[
                styles.performanceText,
                { color: performanceLevel.color },
              ]}
            >
              {performanceLevel.text}
            </Text>

            <View style={styles.scoreDisplay}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreTotal}>/{totalPossible}</Text>
            </View>

            <View style={styles.percentageContainer}>
              <View style={styles.percentageBarBg}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.percentageBarFill,
                    { width: `${percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.percentageText}>
                {percentage.toFixed(1)}% Success Rate
              </Text>
            </View>

            {/* Stats breakdown */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📝</Text>
                <Text style={styles.statValue}>{totalPossible}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>✓</Text>
                <Text style={styles.statValue}>{score}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Stages</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Play again button */}
        <Animated.View
          style={[
            styles.buttonWrapper,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              resetAll();
              router.replace("/");
            }}
            style={styles.btnTouchable}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnIcon}>🔁</Text>
              <Text style={styles.btnText}>Play Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  decorCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.06,
  },
  decorCircle1: {
    backgroundColor: colors.primary,
    top: -100,
    right: -100,
  },
  decorCircle2: {
    backgroundColor: colors.secondary,
    bottom: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  sparkleContainer: {
    position: "absolute",
    width: 300,
    height: 300,
  },
  sparkle: {
    position: "absolute",
    fontSize: 32,
  },
  sparkle1: {
    top: 0,
    left: "50%",
    marginLeft: -16,
  },
  sparkle2: {
    bottom: 0,
    left: "50%",
    marginLeft: -16,
  },
  sparkle3: {
    top: "50%",
    left: 0,
    marginTop: -16,
  },
  sparkle4: {
    top: "50%",
    right: 0,
    marginTop: -16,
  },
  firework: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    top: "40%",
    left: "50%",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  trophyContainer: {
    marginBottom: 20,
  },
  trophyGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  trophyEmoji: {
    fontSize: 80,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 3,
    textAlign: "center",
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 200,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  underlineGradient: {
    flex: 1,
  },
  usernameContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  usernameLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  usernameBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
  achievementText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "500",
  },
  scoreCard: {
    width: "100%",
    marginBottom: 30,
  },
  scoreCardGradient: {
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  performanceEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
    letterSpacing: 2,
  },
  scoreDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  scoreTotal: {
    fontSize: 36,
    fontWeight: "700",
    color: "rgba(255,255,255,0.5)",
    marginLeft: 4,
  },
  percentageContainer: {
    width: "100%",
    marginBottom: 20,
  },
  percentageBarBg: {
    height: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  percentageBarFill: {
    height: "100%",
    borderRadius: 10,
  },
  percentageText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 15,
  },
  buttonWrapper: {
    width: "100%",
  },
  btnTouchable: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.secondary,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  btn: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
});