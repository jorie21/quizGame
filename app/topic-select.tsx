import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";
import { topics } from "../data/topics";
import colors from "../theme/colors";

export default function TopicSelect() {
  const router = useRouter();
  const { setSelectedTopic } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SELECT TOPIC</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        {topics.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.card}
            onPress={() => {
              setSelectedTopic(t.fileKey);
              router.push("/stage-select");
            }}
          >
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.desc}>{t.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  scroll: { paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  title: { color: colors.text, fontSize: 20, fontWeight: "bold" },
  desc: { color: colors.muted, marginTop: 4, fontSize: 14 },
});
