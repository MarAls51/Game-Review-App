import React, { createContext, useState, useEffect, ReactNode } from "react";

interface GameContextType {
  selectedGame: string | null;
  setSelectedGame: (appid: string | null) => void;
}

export const GameContext = createContext<GameContextType>({
  selectedGame: null,
  setSelectedGame: () => {},
});

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(() => {
    return localStorage.getItem("selectedGame") || null;
  });

  useEffect(() => {
    if (selectedGame) {
      localStorage.setItem("selectedGame", selectedGame);
    } else {
      localStorage.removeItem("selectedGame");
    }
  }, [selectedGame]);

  return (
    <GameContext.Provider value={{ selectedGame, setSelectedGame }}>
      {children}
    </GameContext.Provider>
  );
};
