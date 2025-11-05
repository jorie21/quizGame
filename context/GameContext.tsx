import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  clearAllProgress,
  getAllProgress,
  getUsername,
  saveProgress,
  saveUsername,
} from "../utils/storage";

interface GameContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  selectedTopic: string | null;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string | null>>;
  stage: number;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  resetStage: () => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  resetAll: () => Promise<void>;

  stageProgress: Record<string, number[]>; // topic → completed stages
  markStageCompleted: (topic: string, stage: number) => Promise<void>;
  loadProgress: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [stage, setStage] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<Record<string, number[]>>({});

  // 🔹 Load saved username and progress once on start
  useEffect(() => {
    (async () => {
      const savedName = await getUsername();
      if (savedName) setUsername(savedName);

      const savedProgress = await getAllProgress();
      if (savedProgress) setStageProgress(savedProgress);
    })();
  }, []);

  const resetStage = () => setScore(0);

  // 🧹 Fully clear local data (username + all topic progress)
  const resetAll = async () => {
    try {
      await clearAllProgress(); // ✅ new helper clears AsyncStorage keys
      setUsername("");
      setSelectedTopic(null);
      setStage(1);
      setScore(0);
      setStageProgress({});
      console.log("✅ All game data cleared successfully");
    } catch (error) {
      console.error("❌ Error resetting progress:", error);
    }
  };

  // ✅ Mark a stage as completed for a topic
  const markStageCompleted = async (topic: string, stageNumber: number) => {
    const updated = { ...stageProgress };
    const completed = new Set(updated[topic] || []);
    completed.add(stageNumber);
    updated[topic] = Array.from(completed);
    setStageProgress(updated);
    await saveProgress(topic, updated[topic]);
  };

  // ✅ Reload saved progress
  const loadProgress = async () => {
    const savedProgress = await getAllProgress();
    setStageProgress(savedProgress);
  };

  // ✅ Persist username automatically
  useEffect(() => {
    if (username) saveUsername(username);
  }, [username]);

  return (
    <GameContext.Provider
      value={{
        username,
        setUsername,
        selectedTopic,
        setSelectedTopic,
        stage,
        setStage,
        score,
        setScore,
        resetStage,
        resetAll,
        stageProgress,
        markStageCompleted,
        loadProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
