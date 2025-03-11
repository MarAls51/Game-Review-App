import { useContext, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { HeroLandingPageCards, GamePageCards } from "../components/HeroCards";
import { GameContext } from "../context/context";
import { GameCard } from "../components/HeroCards";

export const Hero = () => {
  const [games, setGames] = useState<any[]>([]);
  const { selectedGame } = useContext(GameContext);

  const handleSearch = (searchResults: any[]) => {
    setGames(searchResults);
  };

  return (
    <section className="container relative flex flex-col items-center text-center lg:text-start justify-center py-20 md:py-32 gap-10">
      <div className="absolute top-[70px] left-[20px] w-full overflow-hidden lg:block hidden">
        <HeroLandingPageCards />
      </div>

      <div className="space-y-6 mt-32">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            Find{" "}
            <span className="inline bg-gradient-to-r from-[#00FF00] to-[#32CD32] text-transparent bg-clip-text">
              YOUR
            </span>{" "}
          </h1>{" "}
          <h2 className="inline">Game</h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Simply search for the game you're interested in, and we'll tell you if
          it's worth your time!
        </p>

        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="w-full mt-10">
        {games.length === 0 && selectedGame ? (
          <div className="w-full flex justify-center">
            <GameCard game={selectedGame} />
          </div>
        ) : (
          <GamePageCards games={games} />
        )}
      </div>

      <div className="shadow"></div>
    </section>
  );
};
