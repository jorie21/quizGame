import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TimerBar from "../components/TimeBar";
import { useGame } from "../context/GameContext";
import colors from "../theme/colors";
import { getQuestionsByTopic } from "../utils/getQuestions";
import { shuffleArray } from "../utils/shuffleArray";

const { width } = Dimensions.get("window");

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizScreen() {
  const router = useRouter();
  const { selectedTopic, stage, score, setScore } = useGame();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef(
    Array(4)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  // Floating background animation
  useEffect(() => {
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

  // Load questions
  useEffect(() => {
    if (!selectedTopic) {
      router.replace("/topic-select");
      return;
    }

    const all = getQuestionsByTopic(selectedTopic);
    if (!all || all.length === 0) {
      console.warn(`No questions found for topic: ${selectedTopic}`);
      setQuestions([]);
      return;
    }

    const shuffled = shuffleArray(all);
    const start = (stage - 1) * 20;
    const stageSet = shuffled.slice(start, start + 20);

    setQuestions(stageSet);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setIsTimeUp(false);
    setTimerKey(0);
  }, [selectedTopic, stage, router]);

  // Animate options on question change
  useEffect(() => {
    if (questions.length > 0) {
      optionAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          delay: index * 100,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [current, questions]);

  // Navigate after showing result
  useEffect(() => {
    if (showResult) {
      const t = setTimeout(() => {
        router.replace("/result");
      }, 800);
      return () => clearTimeout(t);
    }
  }, [showResult, router]);

  // Handle answer selection
  const handleAnswer = (option: string) => {
    if (!questions[current] || selected) return;
    const correct = questions[current].answer;
    setSelected(option);

    if (option === correct) {
      setScore((prev: number) => prev + 1);
      // Success pulse animation
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    } else {
      // Error shake animation
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.98, duration: 50, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.02, duration: 50, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.98, duration: 50, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
      ]).start();
    }

    setTimeout(() => {
      nextQuestion();
    }, 700);
  };

  // Go to next question
  const nextQuestion = () => {
    setIsTimeUp(false);
    if (current + 1 < questions.length) {
      // Reset option animations
      optionAnims.forEach((anim) => anim.setValue(0));

      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        setSelected(null);
        setCurrent((prev) => prev + 1);
        setTimerKey((prev) => prev + 1);
      });
    } else {
      setShowResult(true);
    }
  };

  // Handle time running out
  const handleTimeUp = () => {
    if (!selected && !isTimeUp) {
      setIsTimeUp(true);
      setTimeout(() => nextQuestion(), 800);
    }
  };

  // Loading guard
  if (!questions.length) {
    return (
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingSpinner}>
          <Text style={styles.loadingEmoji}>⏳</Text>
          <Text style={styles.loadingText}>Loading Questions...</Text>
        </View>
      </LinearGradient>
    );
  }

  const q = questions[current];
  const total = questions.length;
  const progressPercent = ((current + 1) / total) * 100;

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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.stageContainer}>
          <Text style={styles.stageLabel}>Stage</Text>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.stageBadge}
          >
            <Text style={styles.stageNumber}>{stage}</Text>
          </LinearGradient>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Question {current + 1} / {total}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      {/* Timer */}
      {!showResult && (
        <TimerBar
          key={timerKey}
          trigger={timerKey}
          duration={25}
          onTimeUp={handleTimeUp}
        />
      )}

      {/* Question Card */}
      <Animated.View
        style={[
          styles.questionCard,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
          style={styles.cardGradient}
        >
          <View style={styles.questionHeader}>
            <Text style={styles.questionLabel}>🎯 Question</Text>
          </View>
          
          <Text style={styles.questionText}>{q.question}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {q.options.map((opt, i) => {
              const isSelected = selected === opt;
              const correct = selected && opt === q.answer;
              const wrong = selected && isSelected && opt !== q.answer;

              const optionTranslateY = optionAnims[i].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              });

              return (
                <Animated.View
                  key={i}
                  style={{
                    opacity: optionAnims[i],
                    transform: [{ translateY: optionTranslateY }],
                  }}
                >
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleAnswer(opt)}
                    disabled={!!selected}
                    activeOpacity={0.8}
                  >
                    {correct || wrong ? (
                      <LinearGradient
                        colors={
                          correct
                            ? ["#10b981", "#059669"]
                            : ["#ef4444", "#dc2626"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                      >
                        <View style={styles.optionContent}>
                          <View style={styles.optionIcon}>
                            <Text style={styles.optionIconText}>
                              {String.fromCharCode(65 + i)}
                            </Text>
                          </View>
                          <Text style={styles.optionText}>{opt}</Text>
                          <Text style={styles.optionEmoji}>
                            {correct ? "✓" : "✗"}
                          </Text>
                        </View>
                      </LinearGradient>
                    ) : (
                      <View style={styles.optionContent}>
                        <View style={[styles.optionIcon, isSelected && styles.optionIconSelected]}>
                          <Text style={styles.optionIconText}>
                            {String.fromCharCode(65 + i)}
                          </Text>
                        </View>
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                          {opt}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  decorCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.08,
  },
  decorCircle1: {
    backgroundColor: colors.primary,
    top: 100,
    right: -50,
  },
  decorCircle2: {
    backgroundColor: colors.secondary,
    bottom: 150,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  stageContainer: {
    alignItems: "center",
  },
  stageLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stageBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.secondary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  stageNumber: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  scoreContainer: {
    alignItems: "center",
  },
  scoreLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scoreBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  scoreText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "900",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  progressPercent: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 10,
  },
  questionCard: {
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardGradient: {
    padding: 24,
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionLabel: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  questionText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  optionSelected: {
    borderColor: colors.secondary,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  optionGradient: {
    padding: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionIconSelected: {
    backgroundColor: colors.secondary,
  },
  optionIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  optionText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#fff",
  },
  optionEmoji: {
    fontSize: 20,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingSpinner: {
    alignItems: "center",
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});