import React, { createContext, useState, useEffect, ReactNode } from "react";

interface game {
  appid: any;
  name: any;
  details: any;
}

interface GameContextType {
  selectedGame: game | null;
  setSelectedGame: (game: game | null) => void;
}

export const GameContext = createContext<GameContextType>({
  selectedGame: null,
  setSelectedGame: () => {},
});

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [selectedGame, setSelectedGame] = useState<game | null>(() => {
    try {
      const storedGame = localStorage.getItem("selectedGame");
      return storedGame ? JSON.parse(storedGame) : null;
    } catch (error) {
      console.error("Error parsing selected game from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (selectedGame) {
        localStorage.setItem("selectedGame", JSON.stringify(selectedGame));
      } else {
        localStorage.removeItem("selectedGame");
      }
    } catch (error) {
      console.error("Error storing selected game in localStorage:", error);
    }
  }, [selectedGame]);

  return (
    <GameContext.Provider value={{ selectedGame, setSelectedGame }}>
      {children}
    </GameContext.Provider>
  );
};
