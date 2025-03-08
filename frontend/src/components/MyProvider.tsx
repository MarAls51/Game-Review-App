import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { Tldr } from "./Tldr";

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
  personalizedReview: any;
  loading: boolean;
}

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
  const [personalizedReview, setPersonalizedReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchInProgress = useRef(false);

  useEffect(() => {
    if (selectedGame && !fetchInProgress.current) {
      setLoading(true);
      fetchInProgress.current = true;
      const fetchTldrData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/generalReview`,
            {
              params: { appid: selectedGame.appid, name: selectedGame.name },
            },
          );
          setTldrData(response.data);
        } catch (error) {
          console.error("Failed to fetch TLDR data", error);
        } finally {
          setLoading(false);
          fetchInProgress.current = false;
        }
      };

      fetchTldrData();
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

  // useEffect(() => {
  //   if (!user?.profile.sub || !selectedGame || !tldrData) {
  //     setPersonalizedReview(null);
  //     return;
  //   }

  //   const fetchPersonalizedReview = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/personalizedReview`,
  //         {
  //           params: { sub: user?.profile.sub, name: selectedGame.name },
  //         }
  //       );
  //       setPersonalizedReview(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch personalized review", error);
  //     }
  //   };

  //   fetchPersonalizedReview();
  // }, [user, selectedGame, tldrData]);

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
