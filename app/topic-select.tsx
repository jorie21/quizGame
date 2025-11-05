import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { topics } from "../data/topics";
import colors from "../theme/colors";

const { width } = Dimensions.get("window");

export default function TopicSelect() {
  const router = useRouter();
  const { setSelectedTopic } = useGame();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

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

  const topicEmojis: { [key: string]: string } = {
    gk: "🌍",
    science: "🔬",
    history: "📜",
    geography: "🗺️",
    sports: "⚽",
    entertainment: "🎬",
    technology: "💻",
    arts: "🎨",
    literature: "📚",
    music: "🎵",
  };

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Choose Your</Text>
          <Text style={styles.headerSubtitle}>CHALLENGE</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.View
        style={[
          styles.scrollContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {topics.map((t, index) => {
            const delay = index * 100;
            const cardAnim = new Animated.Value(0);

            setTimeout(() => {
              Animated.spring(cardAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
              }).start();
            }, delay);

            return (
              <Animated.View
                key={t.id}
                style={{
                  opacity: cardAnim,
                  transform: [
                    {
                      translateX: cardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedTopic(t.fileKey);
                   router.push({
                      pathname: "/learning-module",
                      params: { topic: t.fileKey },
                    });
                  }}
                >
                  <LinearGradient
                    colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>
                          {topicEmojis[t.fileKey] || "📌"}
                        </Text>
                      </View>
                      <View style={styles.cardBadge}>
                        <Text style={styles.badgeText}>NEW</Text>
                      </View>
                    </View>
                    <Text style={styles.title}>{t.title}</Text>
                    <Text style={styles.desc}>{t.description}</Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.difficultyContainer}>
                        <Text style={styles.difficultyDot}>●</Text>
                        <Text style={styles.difficultyDot}>●</Text>
                        <Text style={styles.difficultyDot}>●</Text>
                      </View>
                      <Text style={styles.arrowIcon}>→</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  backIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 2,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 28,
  },
  cardBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  desc: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 4,
  },
  difficultyDot: {
    color: colors.secondary,
    fontSize: 12,
  },
  arrowIcon: {
    fontSize: 20,
    color: colors.secondary,
    fontWeight: "bold",
  },
});