import { useState, useContext } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { GameContext } from "../context/context";
import { LoadingScreen } from "../components/LoadingScreen";
import { TldrYear } from "../components/TldrYear";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getYouTubeEmbedUrl } from "@/utils/videoUtils";

export const Tldr = () => {
  const { selectedGame, tldrData } = useContext(GameContext);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  if (!selectedGame) {
    return <LoadingScreen text="Please first select a game..." />;
  }

  const movies = selectedGame.movies || [];
  const screenshots = selectedGame.screenshots || [];
  const hasMovies = movies.length > 0;
  const hasScreenshots = screenshots.length > 0;
  const rawVideoUrl = hasMovies ? movies[currentVideoIndex]?.url : null;
  const isSteam = selectedGame.type === "steam";
  const isYouTube = rawVideoUrl?.includes("youtube.com") || rawVideoUrl?.includes("youtu.be");

  const videoSrc = isYouTube
    ? getYouTubeEmbedUrl(rawVideoUrl)
    : isSteam
      ? rawVideoUrl
      : null;

  const screenshotSrc =
    !hasMovies && hasScreenshots
      ? screenshots[currentScreenshotIndex]?.path_full
      : null;

  const handleNextMedia = (next: boolean, isVideo: boolean) => {
    if (isVideo) {
      if (!hasMovies) return;
      setCurrentVideoIndex((prevIndex) =>
        next
          ? (prevIndex + 1) % movies.length
          : (prevIndex - 1 + movies.length) % movies.length,
      );
    } else {
      if (!hasScreenshots) return;
      setCurrentScreenshotIndex((prevIndex) =>
        next
          ? (prevIndex + 1) % screenshots.length
          : (prevIndex - 1 + screenshots.length) % screenshots.length,
      );
    }
  };

  return (
    <section id="features" className="container py-24 sm:py-32 space-y-6">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        The{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          TLDR
        </span>
      </h2>
      <p className="text-center text-xl text-muted-foreground mt-0 mb-2">
        This section provides a brief, concise, and accurate review of what the
        game has to offer for those in a hurry.
      </p>
      <div className="flex justify-center items-center gap-4 mb-8">
        {(hasMovies || hasScreenshots) && (
          <button
            className="p-2 bg-primary text-white rounded-full"
            onClick={() => handleNextMedia(false, hasMovies)}
          >
            <HiChevronLeft />
          </button>
        )}

        <Card className="w-[75%]">
          <CardHeader>
            <CardTitle className="text-center">{selectedGame.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isSteam && videoSrc ? (
              <video
                controls
                src={videoSrc}
                className="w-full h-[500px] lg:w-[800px] lg:h-[500px] rounded-lg"
              />
            ) : isYouTube && videoSrc ? (
              <iframe
                src={videoSrc}
                className="w-full h-[500px] lg:w-[800px] lg:h-[500px] rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : screenshotSrc ? (
              <img
                src={screenshotSrc}
                alt={`Screenshot ${currentScreenshotIndex + 1}`}
                className="w-full h-[500px] lg:w-[800px] lg:h-[500px] rounded-lg object-cover"
              />
            ) : (
              <p className="text-center">No media available.</p>
            )}
          </CardContent>

          <CardFooter>
            <div>
              <CardTitle className="text-center">Description</CardTitle>
              <p className="pt-4">{selectedGame.description}</p>
            </div>
          </CardFooter>
        </Card>

        {(hasMovies || hasScreenshots) && (
          <button
            className="p-2 bg-primary text-white rounded-full"
            onClick={() => handleNextMedia(true, hasMovies)}
          >
            <HiChevronRight />
          </button>
        )}
      </div>

      {tldrData ? (
        <TldrYear />
      ) : (
        <LoadingScreen text="Loading results, please wait..." />
      )}
    </section>
  );
};
