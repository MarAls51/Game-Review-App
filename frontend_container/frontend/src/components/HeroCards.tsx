import { Avatar, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import "swiper/css";
import "swiper/css/autoplay";
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/context.tsx";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { fetchTestimonials } from "@/services/apiService.tsx";

interface Testimonial {
  alias: string;
  testimonial: string;
}

export const HeroLandingPageCards = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTestimonials(); 
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Swiper
      modules={[Autoplay]}
      slidesPerView={3}
      loop={true}
      className="w-full"
    >
      {testimonials.filter(user => user.testimonial).map((user, index) => (
        <SwiperSlide key={index}>
          <Card className="w-[340px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage
                  alt={user.alias}
                  src={"/assets/mort.jpg"}
                />
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-lg">
                  {user.alias || "Anonymous"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {user.testimonial}
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

interface GameCardProps {
  games: any[];
}
interface GameCard {
  game: any;
}

export const GameCard: React.FC<GameCard> = ({ game }) => {
  const { selectedGame, setSelectedGame, loading } = useContext(GameContext);
  const [showMessage, setShowMessage] = useState<string>("");

  const handleSelectClick = () => {
    if (loading) {
      setShowMessage(
        "You must wait for review content to be loaded before selecting another card.",
      );
      setTimeout(() => setShowMessage(""), 5000);
      return;
    }
    if (selectedGame?.appid === game.appid) {
      setSelectedGame(null);
    } else {
      setSelectedGame(game);
    }
  };

  const isSelected = selectedGame?.appid === game.appid;

  const truncateDescription = (desc: string) => {
    if (!desc) return "No description available.";
    return desc.length > 400 ? desc.slice(0, 400) + "..." : desc;
  };

  return game ? (
    <Card
      className={`w-[340px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 transform transition-transform duration-300 ease-in-out overflow-hidden
          ${isSelected ? "scale-95 rotate-3" : "scale-90"}`}
      style={{ transformOrigin: "center" }}
    >
      {game.screenshots?.length > 0 && (
        <img
          src={game.screenshots[0].path_full}
          alt={`${game.name} screenshot`}
          className="w-full object-cover rounded-t-lg"
        />
      )}
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg text-center">{game.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {truncateDescription(game.description)}
      </CardContent>
      <CardFooter className="flex justify-center pb-4">
        <button
          onClick={handleSelectClick}
          className={`${
            isSelected ? "bg-red-500" : "bg-green-500"
          } text-white font-bold py-2 px-4 rounded w-1/2 hover:${isSelected ? "bg-red-600" : "bg-green-600"}`}
        >
          {isSelected ? "Unselect" : "Select"}
        </button>
      </CardFooter>
      {showMessage && (
        <div className="text-red-400 mt-5 text-center pb-4">{showMessage}</div>
      )}
    </Card>
  ) : null;
};

export const GamePageCards: React.FC<GameCardProps> = ({ games }) => {
  return (
    <Swiper
      modules={[Autoplay]}
      slidesPerView={3}
      loop={true}
      className="w-full"
    >
      {games.length > 0 &&
        games.map((game) => (
          <SwiperSlide key={game.appid} className="pb-[50px]">
            <GameCard game={game} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};