import { Slot } from 'expo-router';
import React from 'react';
import { GameProvider } from '../contexts/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <Slot />
    </GameProvider>
  );
}
