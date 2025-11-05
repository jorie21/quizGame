import AsyncStorage from "@react-native-async-storage/async-storage";

const USERNAME_KEY = "quiz_username";
const PROGRESS_KEY = "quiz_progress";

/** Save username permanently */
export const saveUsername = async (username: string) => {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, username);
  } catch (error) {
    console.error("Error saving username:", error);
  }
};

/** Get stored username */
export const getUsername = async (): Promise<string | null> => {
  try {
    const name = await AsyncStorage.getItem(USERNAME_KEY);
    return name;
  } catch (error) {
    console.error("Error fetching username:", error);
    return null;
  }
};

/** Save stage progress by topic */
export const saveProgress = async (topic: string, completedStages: number[]) => {
  try {
    const existing = await getAllProgress();
    const updated = { ...existing, [topic]: completedStages };
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

/** Get all progress (object: topic → completedStages[]) */
export const getAllProgress = async (): Promise<Record<string, number[]>> => {
  try {
    const json = await AsyncStorage.getItem(PROGRESS_KEY);
    return json ? JSON.parse(json) : {};
  } catch (error) {
    console.error("Error fetching progress:", error);
    return {};
  }
};

/** Get progress for one topic */
export const getProgressByTopic = async (topic: string): Promise<number[]> => {
  const all = await getAllProgress();
  return all[topic] || [];
};

/** ✅ Clear username and all saved progress */
export const clearAllProgress = async () => {
  try {
    await AsyncStorage.multiRemove([USERNAME_KEY, PROGRESS_KEY]);
    console.log("🧹 Cleared quiz_username and quiz_progress keys");
  } catch (err) {
    console.error("Error clearing data:", err);
  }
};
