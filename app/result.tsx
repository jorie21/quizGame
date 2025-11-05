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

const { width } = Dimensions.get("window");

export default function ResultScreen() {
  const router = useRouter();
  const {
    score,
    stage,
    resetStage,
    resetAll,
    selectedTopic,
    markStageCompleted, // ✅ imported from context
  } = useGame();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const buttonScale1 = useRef(new Animated.Value(0)).current;
  const buttonScale2 = useRef(new Animated.Value(0)).current;

  const confettiAnims = useRef(
    Array(8)
      .fill(0)
      .map(() => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        rotate: new Animated.Value(0),
        opacity: new Animated.Value(0),
      }))
  ).current;

  // ✅ NEW: Save stage progress when user reaches this screen
  useEffect(() => {
    if (selectedTopic) {
      markStageCompleted(selectedTopic, stage);
    }
  }, [selectedTopic, stage]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
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

    // Confetti animation
    confettiAnims.forEach((anim, index) => {
      const delay = index * 100;
      const xTarget = (Math.random() - 0.5) * 300;
      const yTarget = -300 - Math.random() * 200;

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim.x, {
            toValue: xTarget,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.y, {
            toValue: yTarget,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotate, {
            toValue: Math.random() * 360,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });

    setTimeout(() => {
      Animated.spring(buttonScale1, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.spring(buttonScale2, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  // ✅ Keep your same navigation behavior
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

  const percentage = (score / 20) * 100;
  const performanceEmoji =
    percentage >= 80
      ? "🔥"
      : percentage >= 60
      ? "⭐"
      : percentage >= 40
      ? "👍"
      : "💪";
  const performanceText =
    percentage >= 80
      ? "Outstanding!"
      : percentage >= 60
      ? "Great Job!"
      : percentage >= 40
      ? "Good Effort!"
      : "Keep Trying!";

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <Animated.View
        style={[styles.decorCircle, styles.decorCircle1, { transform: [{ translateY: floatAnim }] }]}
      />
      <Animated.View
        style={[styles.decorCircle, styles.decorCircle2, { transform: [{ translateY: floatAnim }] }]}
      />

      {confettiAnims.map((anim, index) => {
        const colorsArr = [colors.primary, colors.secondary, "#fbbf24", "#10b981", "#ef4444"];
        const color = colorsArr[index % colorsArr.length];
        return (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                backgroundColor: color,
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.x },
                  { translateY: anim.y },
                  {
                    rotate: anim.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Stage Complete Header */}
        <Animated.View
          style={[styles.headerContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.stageCompleteBox}>
            <Text style={styles.stageLabel}>Stage {stage}</Text>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completeTag}
            >
              <Text style={styles.completeText}>COMPLETE ✓</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Score Display */}
        <Animated.View
          style={[styles.scoreContainer, { transform: [{ scale: pulseAnim }] }]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
            style={styles.scoreCard}
          >
            <Text style={styles.performanceEmoji}>{performanceEmoji}</Text>
            <Text style={styles.performanceText}>{performanceText}</Text>

            <View style={styles.scoreDisplay}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreTotal}>/20</Text>
            </View>

            <Text style={styles.percentageText}>{percentage.toFixed(0)}% Correct</Text>
          </LinearGradient>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale1 }] }}>
            <TouchableOpacity activeOpacity={0.85} onPress={handleNext} style={styles.btnWrapper}>
              <LinearGradient
                colors={[colors.primary, colors.secondary, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>
                  {stage < 5 ? "Next Stage" : "Finish Game"}
                </Text>
                <Text style={styles.btnIcon}>{stage < 5 ? "→" : "🏆"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonScale2 }] }}>
            <TouchableOpacity activeOpacity={0.85} onPress={handleRestart}>
              <View style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>🔄 Restart Game</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  decorCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.08,
  },
  decorCircle1: { backgroundColor: colors.primary, top: -50, right: -80 },
  decorCircle2: { backgroundColor: colors.secondary, bottom: -50, left: -80 },
  confetti: { position: "absolute", width: 12, height: 12, top: "50%", left: "50%" },
  content: { width: "100%", alignItems: "center" },
  headerContainer: { marginBottom: 30 },
  stageCompleteBox: { alignItems: "center" },
  stageLabel: { color: "rgba(255,255,255,0.6)", fontSize: 16, fontWeight: "600", marginBottom: 12 },
  completeTag: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: colors.secondary,
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  completeText: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 2 },
  scoreContainer: { width: "100%", marginBottom: 30 },
  scoreCard: {
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  performanceEmoji: { fontSize: 56, marginBottom: 8 },
  performanceText: { color: colors.secondary, fontSize: 20, fontWeight: "700", marginBottom: 20 },
  scoreDisplay: { flexDirection: "row", alignItems: "baseline", marginBottom: 20 },
  scoreNumber: { fontSize: 80, fontWeight: "900", color: "#fff" },
  scoreTotal: { fontSize: 36, color: "rgba(255,255,255,0.5)", marginLeft: 4 },
  percentageText: { color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: "600" },
  buttonsContainer: { width: "100%", gap: 16 },
  btnWrapper: { width: "100%", borderRadius: 16, overflow: "hidden" },
  primaryBtn: { paddingVertical: 18, flexDirection: "row", justifyContent: "center" },
  primaryBtnText: { color: "#fff", fontSize: 18, fontWeight: "800", marginRight: 8 },
  btnIcon: { fontSize: 20 },
  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },
  secondaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
