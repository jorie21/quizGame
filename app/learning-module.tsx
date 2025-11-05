import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useGame } from "../context/GameContext";
import { learningModules } from "../data/learningModules";
import colors from "../theme/colors";

export default function LearningModule() {
  const router = useRouter();
  const { topic } = useLocalSearchParams();
  const { setSelectedTopic } = useGame();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const module = learningModules[topic as string];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    setSelectedTopic(topic as string);
    router.push("/stage-select");
  };

  if (!module) {
    return (
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.center}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Module not found.</Text>
      </LinearGradient>
    );
  }

  const topicEmojis: Record<string, string> = {
    software: "💻",
    hardware: "🧩",
    networking: "🌐",
    programming: "👨‍💻",
    database: "🗄️",
    ai: "🤖",
    cybersecurity: "🛡️",
    cloud: "☁️",
    iot: "📶",
    dataScience: "📊",
    osConcepts: "⚙️",
    webDev: "🌍",
    mobileDev: "📱",
    digitalLogic: "🔢",
    uiux: "🎨",
    ecommerce: "🛒",
    systemAnalysis: "📋",
    projectManagement: "📈",
    itEthics: "⚖️",
    itHistory: "⌛",
  };

  const emoji = topicEmojis[topic as string] || "📘";

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning Module</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Scrollable Module */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>

          <Text style={styles.topicTitle}>{module.title}</Text>
          <Text style={styles.topicDesc}>{module.intro}</Text>

          {/* Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Sections</Text>
            {module.sections.map((sec, i) => (
              <View key={i} style={styles.subSection}>
                <Text style={styles.subSectionTitle}>{i + 1}. {sec.title}</Text>
                <Text style={styles.sectionText}>{sec.content}</Text>
              </View>
            ))}
          </View>

          {/* Key Concepts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧩 Key Concepts</Text>
            {module.keyConcepts.map((concept, i) => (
              <Text key={i} style={styles.sectionText}>• {concept}</Text>
            ))}
          </View>

          {/* Practical Examples */}
          {module.practicalExamples && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧠 Practical Examples</Text>
              {module.practicalExamples.map((ex, i) => (
                <Text key={i} style={styles.sectionText}>• {ex}</Text>
              ))}
            </View>
          )}

          {/* Common Mistakes */}
          {module.commonMistakes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ Common Mistakes</Text>
              {module.commonMistakes.map((m, i) => (
                <Text key={i} style={styles.sectionText}>• {m}</Text>
              ))}
            </View>
          )}

          {/* Study Tip */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Study Tip</Text>
            <Text style={styles.sectionText}>{module.studyTip}</Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity onPress={handleContinue} activeOpacity={0.9}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Continue to Stages →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  backIcon: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  emojiContainer: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emoji: { fontSize: 40 },
  topicTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  topicDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sectionTitle: {
    color: colors.secondary,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 8,
  },
  subSection: {
    marginBottom: 10,
  },
  subSectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 22,
  },
  btn: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.secondary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 1,
  },
});
