import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextType {
  score: number;
  highScore: number;
  updateScore: (newScore: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const updateScore = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <GameContext.Provider value={{ score, highScore, updateScore }}>
      {children}
    </GameContext.Provider>
  );
};
