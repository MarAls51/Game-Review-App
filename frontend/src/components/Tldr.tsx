import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useContext } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { GameContext } from "./MyProvider";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 
import axios from "axios";

const featureList: string[] = ["Filtered", "Unfiltered"];

export const TldrYear = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCard = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="border border-white border-opacity-30 p-4 rounded-lg">
        <Card className="w-full h-[50px]" onClick={toggleCard}>
          <CardTitle className="flex items-center justify-between h-full pl-[15px] select-none">
            <span className="flex-1 text-center">2025</span>
            {isOpen ? (
              <FaChevronUp className="pr-[15px] text-2xl" />
            ) : (
              <FaChevronDown className="pr-[15px] text-2xl" />
            )}
          </CardTitle>
        </Card>

        {isOpen && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col gap-6">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">Bullet Point Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {"filler."}
                  </CardContent>
                </Card>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">Pros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {"filler."}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-6">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">Cons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {"filler."}
                  </CardContent>
                </Card>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">Special Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {"filler."}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex flex-wrap md:justify-center gap-4 mb-8">
              {featureList.map((feature) => (
                <div key={feature} className="p-2 rounded-lg">
                  <Badge variant="secondary" className="text-sm">
                    {feature}
                  </Badge>
                </div>
              ))}
            </div>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-center">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {"filler."}
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-center">Developer Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                {"filler."}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
              <Card className="h-full mb-4">
                <CardHeader>
                  <CardTitle className="text-center">New Card 1</CardTitle>
                </CardHeader>
                <CardContent>
                  {"filler."}
                </CardContent>
              </Card>

              <Card className="h-full mb-4">
                <CardHeader>
                  <CardTitle className="text-center">New Card 2</CardTitle>
                </CardHeader>
                <CardContent>
                  {"filler."}
                </CardContent>
              </Card>

              <Card className="h-full mb-4">
                <CardHeader>
                  <CardTitle className="text-center">New Card 3</CardTitle>
                </CardHeader>
                <CardContent>
                  {"filler"}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const Tldr = () => {
  const { selectedGame } = useContext(GameContext);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [tldrData, setTldrData] = useState(null);
  
  useEffect(() => {
    if (selectedGame) {
      const fetchTldrData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tldr`, {
            params: { appid: selectedGame.appid }, 
          });

          console.log(response.data); 
          setTldrData(response.data);  
        } catch (error) {
          console.error("Failed to fetch TLDR data", error);
        }
      };
  
      fetchTldrData();
    }
  }, [selectedGame]);
  
  
  if (!selectedGame) {
    return <div>Loading...</div>;
  }

  const movies = selectedGame.movies || [];
  const screenshots = selectedGame.screenshots || [];
  const hasMovies = movies.length > 0;
  const hasScreenshots = screenshots.length > 0;

  const rawVideoUrl = hasMovies ? movies[currentVideoIndex]?.url : null;
  const isSteam = selectedGame.type === "steam";
  const isYouTube = rawVideoUrl?.includes("youtube.com") || rawVideoUrl?.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const videoSrc = isYouTube
    ? getYouTubeEmbedUrl(rawVideoUrl)
    : isSteam
    ? rawVideoUrl
    : null;

  const screenshotSrc = !hasMovies && hasScreenshots ? screenshots[currentScreenshotIndex]?.path_full : null;

  const handleNextMedia = (next: boolean, isVideo: boolean) => {
    if (isVideo) {
      if (!hasMovies) return;
      setCurrentVideoIndex((prevIndex) =>
        next ? (prevIndex + 1) % movies.length : (prevIndex - 1 + movies.length) % movies.length
      );
    } else {
      if (!hasScreenshots) return;
      setCurrentScreenshotIndex((prevIndex) =>
        next ? (prevIndex + 1) % screenshots.length : (prevIndex - 1 + screenshots.length) % screenshots.length
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
        This section provides a brief, concise, and accurate review of what the game has to offer for those in a hurry.
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
              <video controls src={videoSrc} className="w-full h-[500px] lg:w-[800px] lg:h-[500px] rounded-lg" />
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
        <div>{JSON.stringify(tldrData)}</div>
      ) : (
        <div>Loading TLDR...</div>
      )}
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <TldrYear key={index} />
        ))}
    </section>
  );
};
