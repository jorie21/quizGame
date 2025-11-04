import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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

// ✅ Define question type for clarity
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

  // ✅ Load questions safely
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

  // ✅ Safe navigation after showing result
  useEffect(() => {
    if (showResult) {
      const t = setTimeout(() => {
        router.replace("/result");
      }, 800);
      return () => clearTimeout(t);
    }
  }, [showResult, router]);

  // ✅ Handle answer selection
  const handleAnswer = (option: string) => {
    if (!questions[current] || selected) return;
    const correct = questions[current].answer;
    setSelected(option);

    if (option === correct) {
      setScore((prev: number) => prev + 1);
    }

    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.6, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      nextQuestion();
    }, 700);
  };

  // ✅ Go to next question or finish stage
  const nextQuestion = () => {
    setIsTimeUp(false);
    if (current + 1 < questions.length) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        setSelected(null);
        setCurrent((prev) => prev + 1);
        setTimerKey((prev) => prev + 1); // Restart timer for new question
      });
    } else {
      setShowResult(true);
    }
  };

  // ✅ Handle time running out
  const handleTimeUp = () => {
    if (!selected && !isTimeUp) {
      setIsTimeUp(true);
      setTimeout(() => nextQuestion(), 800);
    }
  };

  // ✅ Loading guard
  if (!questions.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Questions...</Text>
      </View>
    );
  }

  const q = questions[current];
  const total = questions.length;

  return (
    <View style={styles.container}>
      <Text style={styles.stageText}>Stage {stage}</Text>

      <View style={styles.progressBox}>
        <Text style={styles.progress}>
          Question {current + 1} / {total}
        </Text>
      </View>

      {/* Timer restarts per question */}
      {!showResult && (
        <TimerBar
          key={timerKey}
          trigger={timerKey}
          duration={25}
          onTimeUp={handleTimeUp}
        />
      )}

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.question}>{q.question}</Text>

        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const correct = selected && opt === q.answer;
          const wrong = selected && isSelected && opt !== q.answer;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                isSelected && styles.selected,
                correct && styles.correct,
                wrong && styles.wrong,
              ]}
              onPress={() => handleAnswer(opt)}
              disabled={!!selected}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  stageText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  progressBox: { alignItems: "center", marginVertical: 8 },
  progress: { color: colors.muted, fontSize: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  question: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  option: {
    backgroundColor: "#1f2429",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  selected: { borderColor: colors.accent },
  correct: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  wrong: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.text,
    fontSize: 18,
    textAlign: "center",
  },
});
