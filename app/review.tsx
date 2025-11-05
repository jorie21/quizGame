import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";

const { width } = Dimensions.get("window");

interface AnsweredQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string;
}

export default function ReviewScreen() {
  const router = useRouter();
  const { selectedTopic } = useGame();

  const [reviewData, setReviewData] = useState<AnsweredQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating background animation
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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    loadReviewData();
  }, []);

  // Load saved answers for the topic
  const loadReviewData = async () => {
    try {
      if (!selectedTopic) return;
      const data = await AsyncStorage.getItem(`answers_${selectedTopic}`);
      if (data) {
        setReviewData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load review data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.loadingContainer}
      >
        <Text style={styles.loadingText}>Loading your review...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      {/* Animated decorative background */}
      <Animated.View
        style={[styles.decorCircle, styles.circle1, { transform: [{ translateY: floatAnim }] }]}
      />
      <Animated.View
        style={[styles.decorCircle, styles.circle2, { transform: [{ translateY: floatAnim }] }]}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Answers</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Review list */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {reviewData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No answers saved yet 💤</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {reviewData.map((item, index) => {
              const isCorrect = item.selectedAnswer === item.correctAnswer;
              return (
                <LinearGradient
                  key={index}
                  colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                  style={styles.card}
                >
                  <Text style={styles.questionIndex}>Q{index + 1}.</Text>
                  <Text style={styles.questionText}>{item.question}</Text>

                  <View style={styles.answersContainer}>
                    {item.options.map((opt, i) => {
                      const isSelected = opt === item.selectedAnswer;
                      const isAnswer = opt === item.correctAnswer;

                      let bgColor = "rgba(255,255,255,0.05)";
                      if (isAnswer) bgColor = "rgba(16,185,129,0.3)";
                      if (isSelected && !isAnswer) bgColor = "rgba(239,68,68,0.3)";

                      return (
                        <View key={i} style={[styles.optionBox, { backgroundColor: bgColor }]}>
                          <Text style={styles.optionText}>
                            {String.fromCharCode(65 + i)}. {opt}
                          </Text>
                          {isAnswer ? (
                            <Text style={styles.optionIcon}>✅</Text>
                          ) : isSelected ? (
                            <Text style={styles.optionIcon}>❌</Text>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>

                  <Text style={[styles.resultText, { color: isCorrect ? "#10b981" : "#ef4444" }]}>
                    {isCorrect ? "Correct ✅" : "Wrong ❌"}
                  </Text>
                </LinearGradient>
              );
            })}
          </ScrollView>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  decorCircle: { position: "absolute", borderRadius: 100, opacity: 0.08 },
  circle1: { width: 200, height: 200, backgroundColor: colors.primary, top: 50, right: -50 },
  circle2: { width: 150, height: 150, backgroundColor: colors.secondary, bottom: 100, left: -50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 20,
    marginBottom: 20,
  },
  questionIndex: {
    color: colors.secondary,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 5,
  },
  questionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  answersContainer: { gap: 10 },
  optionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: { color: "#fff", fontSize: 15, flex: 1 },
  optionIcon: { fontSize: 18, marginLeft: 10 },
  resultText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
