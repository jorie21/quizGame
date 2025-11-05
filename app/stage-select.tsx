import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";
import { getProgressByTopic } from "../utils/storage";

export default function StageSelect() {
  const router = useRouter();
  const { setStage, selectedTopic, stageProgress } = useGame();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [floatAnim] = useState(new Animated.Value(0));
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedTopic) {
        const data = await getProgressByTopic(selectedTopic);
        setCompletedStages(data);
      }
    })();
  }, [selectedTopic, stageProgress]);

  const handleStageSelect = (s: number, isDone: boolean) => {
    setStage(s);
    if (isDone) {
      router.push("/review"); // ✅ if already done → go to review
    } else {
      router.push("/quiz"); // otherwise → start quiz
    }
  };

  const handleBack = () => router.back();

  const stageData = [
    { level: 1, label: "Beginner", emoji: "🌱" },
    { level: 2, label: "Easy", emoji: "⭐" },
    { level: 3, label: "Medium", emoji: "🔥" },
    { level: 4, label: "Hard", emoji: "⚡" },
    { level: 5, label: "Expert", emoji: "💎" },
  ];

  return (
    <LinearGradient colors={["#0f0c29", "#302b63", "#24243e"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Your Stage</Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {stageData.map((s, i) => {
          const done = completedStages.includes(s.level);
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.85}
              onPress={() => handleStageSelect(s.level, done)}
            >
              <LinearGradient
                colors={done ? ["#555", "#333"] : [colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.stageCard}
              >
                <Text style={styles.stageEmoji}>{done ? "🔒" : s.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stageTitle}>Stage {s.level}</Text>
                  <Text style={styles.stageLabel}>{s.label}</Text>
                  {done && <Text style={styles.reviewHint}>Tap to Review</Text>}
                </View>
                {done && <Text style={styles.doneMark}>✓</Text>}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  backIcon: { color: "#fff", fontSize: 28, marginRight: 16 },
  headerText: { color: "#fff", fontSize: 24, fontWeight: "900" },
  content: { gap: 14 },
  stageCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  stageEmoji: { fontSize: 26, marginRight: 16 },
  stageTitle: { color: "#fff", fontSize: 20, fontWeight: "900" },
  stageLabel: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  doneMark: { color: "#10b981", fontSize: 20, fontWeight: "bold" },
  reviewHint: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
});
