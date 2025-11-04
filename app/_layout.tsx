import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GameProvider } from "../context/GameContext";

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Slot />
    </GameProvider>
  );
}
