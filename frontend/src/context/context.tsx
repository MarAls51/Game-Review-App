import React, { createContext, useState, useEffect, ReactNode, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { fetchTldrData, fetchPersonalizedReview } from "../services/apiService";
import { Game, GameContextType, TldrData } from "../types/types";

export const GameContext = createContext<GameContextType>({
  selectedGame: null,
  setSelectedGame: () => {},
  tldrData: null,
  personalizedReview: null,
  loading: false,
});

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [tldrData, setTldrData] = useState<TldrData | null>(null);
  const [personalizedReview, setPersonalizedReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const fetchInProgress = useRef(false);

  const [selectedGame, setSelectedGame] = useState<Game | null>(() => {
    try {
      const storedGame = localStorage.getItem("selectedGame");
      return storedGame ? JSON.parse(storedGame) : null;
    } catch (error) {
      console.error("Error parsing selected game from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (selectedGame && !fetchInProgress.current) {
      setLoading(true);
      fetchInProgress.current = true;

      const getTldrData = async () => {
        try {
          const data = await fetchTldrData(selectedGame.appid, selectedGame.name);
          setTldrData(data);
        } catch (error) {
          console.error("Failed to fetch TLDR data", error);
        } finally {
          setLoading(false);
          fetchInProgress.current = false;
        }
      };

      getTldrData();
    } else {
      setTldrData(null);
    }
  }, [selectedGame]);

  useEffect(() => {
    try {
      setTldrData(null);
      if (selectedGame) {
        localStorage.setItem("selectedGame", JSON.stringify(selectedGame));
      } else {
        localStorage.removeItem("selectedGame");
      }
    } catch (error) {
      console.error("Error storing selected game in localStorage:", error);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (!user?.profile.sub || !selectedGame || !tldrData) {
      setPersonalizedReview(null);
      return;
    }

    const getPersonalizedReview = async () => {
      try {
        const review = await fetchPersonalizedReview(user?.profile.sub, selectedGame.name);
        setPersonalizedReview(review);
      } catch (error) {
        console.error("Failed to fetch personalized review", error);
      }
    };

    getPersonalizedReview();
  }, [user, selectedGame, tldrData]);

  return (
    <GameContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        tldrData,
        personalizedReview,
        loading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
