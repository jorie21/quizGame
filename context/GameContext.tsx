import React, { createContext, ReactNode, useContext, useState } from "react";

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

  resetAll: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [stage, setStage] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  const resetStage = () => {
    setScore(0);
  };

  const resetAll = () => {
    setUsername("");
    setSelectedTopic(null);
    setStage(1);
    setScore(0);
  };

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
