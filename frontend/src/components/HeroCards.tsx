import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
// import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import React, { useContext } from "react";
import { GameContext } from "./MyProvider.tsx";
// import axios from "axios";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage alt="" src="https://github.com/shadcn.png" />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">John Doe React</CardTitle>
            <CardDescription>@john_doe</CardDescription>
          </div>
        </CardHeader>

        <CardContent>This landing page is awesome!</CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src="https://i.pravatar.cc/150?img=58"
            alt="user avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Leo Miranda</CardTitle>
          <CardDescription className="font-normal text-primary">
            Frontend Developer
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            I really enjoy transforming ideas into functional software that
            exceeds expectations
          </p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://github.com/leoMirandaa"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Github icon</span>
              <GitHubLogoIcon className="w-5 h-5" />
            </a>
            <a
              rel="noreferrer noopener"
              href="https://twitter.com/leo_mirand4"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">X icon</span>
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-foreground w-5 h-5"
              >
                <title>X</title>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>

            <a
              rel="noreferrer noopener"
              href="https://www.linkedin.com/in/leopoldo-miranda/"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Linkedin icon</span>
              <Linkedin size="20" />
            </a>
          </div>
        </CardFooter>
      </Card>

      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Free
            <Badge variant="secondary" className="text-sm text-primary">
              Most popular
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>
            Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">Start Free Trial</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["4 Team member", "4 GB Storage", "Upto 6 pages"].map(
              (benefit: string) => (
                <span key={benefit} className="flex">
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              ),
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Light & dark mode</CardTitle>
            <CardDescription className="text-md mt-2">
              Lorem ipsum dolor sit amet consect adipisicing elit. Consectetur
              natusm.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

export const HeroLandingPageCards = () => {
  return (
    <Swiper
      modules={[Autoplay]}
      slidesPerView={3}
      loop={true}
      className="w-full"
    >
      <SwiperSlide>
        <Card className="w-[340px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage alt="" src="https://github.com/shadcn.png" />
              <AvatarFallback>SH</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-lg">John Doe React</CardTitle>
              <CardDescription>@john_doe</CardDescription>
            </div>
          </CardHeader>
          <CardContent>This landing page is awesome!</CardContent>
        </Card>
      </SwiperSlide>

      <SwiperSlide>
        <Card className="w-[340px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage alt="" src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-lg">Jane Doe React</CardTitle>
              <CardDescription>@jane_doe</CardDescription>
            </div>
          </CardHeader>
          <CardContent>This landing page changed my workflow!</CardContent>
        </Card>
      </SwiperSlide>
      <SwiperSlide>
        <Card className="w-[340px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage alt="" src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-lg">Jane Doe React</CardTitle>
              <CardDescription>@jane_doe</CardDescription>
            </div>
          </CardHeader>
          <CardContent>This landing page changed my workflow!</CardContent>
        </Card>
      </SwiperSlide>
      <SwiperSlide>
        <Card className="w-[340px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage alt="" src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-lg">Jane Doe React</CardTitle>
              <CardDescription>@jane_doe</CardDescription>
            </div>
          </CardHeader>
          <CardContent>This landing page changed my workflow!</CardContent>
        </Card>
      </SwiperSlide>
    </Swiper>
  );
};

interface GameCardProps {
  games: any[];
}

interface game {
  type: any;
  appid: any;
  name: any;
  description: any;
  screenshots: any;
  movies: any;
}

interface GameCard {
  game: any;
}

export const GameCard: React.FC<GameCard> = ({ game }) => {
  const { selectedGame, setSelectedGame } = useContext(GameContext);

  const handleSelectClick = () => {
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