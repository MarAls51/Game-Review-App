import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

interface Game {
  type: any;
  appid: any;
  name: any;
  description: any;
  screenshots: any;
  movies: any;
}

interface GameContextType {
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  tldrData: any;
}

export const GameContext = createContext<GameContextType>({
  selectedGame: null,
  setSelectedGame: () => {},
  tldrData: null,
});

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(() => {
    try {
      const storedGame = localStorage.getItem("selectedGame");
      return storedGame ? JSON.parse(storedGame) : null;
    } catch (error) {
      console.error("Error parsing selected game from localStorage:", error);
      return null;
    }
  });

  const [tldrData, setTldrData] = useState<any>(null);

  useEffect(() => {
    if (selectedGame) {
      const fetchTldrData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/generalReview`, {
            params: { appid: selectedGame.appid }, 
          });
          setTldrData(response.data);  
        } catch (error) {
          console.error("Failed to fetch TLDR data", error);
        }
      };
  
      fetchTldrData();
    } else {
      setTldrData(null)
    }
  }, [selectedGame]);

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
    <GameContext.Provider value={{ selectedGame, setSelectedGame, tldrData }}>
      {children}
    </GameContext.Provider>
  );
};
