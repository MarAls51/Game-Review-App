import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useContext, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { GameContext } from "./MyProvider";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LoadingScreen } from "./LoadingScreen";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const featureList: string[] = ["Filtered", "Unfiltered"];

type BulletPointSummary = {
  graphics: string;
  gameplay: string;
  audio: string;
  audience: string[];
  pc_requirements: string;
  difficulty: string;
  grind: string;
  story: string;
  game_time: string;
  price: string;
  bugs: string;
};

type TldrData = {
  bullet_point_summary: BulletPointSummary;
  pros: string;
  cons: string;
  notable_mentions: string;
  grade: string;
  bottom_line_summary: string;
  developer_reputation: string;
  review_weight: string;
};

interface GameContextType {
  tldrData: TldrData;
}

const bulletPointOptions: Record<keyof BulletPointSummary, string[]> = {
  graphics: ["Beautiful", "Good", "Decent", "Bad", "Terrible"],
  gameplay: ["Addictive like heroin", "Very good", "Good", "Ok", "Terrible"],
  audio: ["Eargasm", "Very good", "Good", "Not too bad", "Bad", "Earrape"],
  audience: ["Kids", "Teens", "Adults", "Grandma"],
  pc_requirements: ["Laptops can run it", "Decent", "Fast", "Quantum computer"],
  difficulty: ["Brain not required", "Casual", "Difficult", "Dark Souls"],
  grind: [
    "Nothing to grind",
    "Only if you care about leaderboards/ranks",
    "Isn't necessary to progress",
    "Average grind level",
    "Too much grind",
  ],
  story: [
    "Text or Audio floating around",
    "Some lore",
    "Average",
    "Good",
    "Lovely",
    "It'll replace your life",
  ],
  game_time: [
    "Long enough for a cup of tea",
    "Short",
    "Average",
    "Long",
    "Replayable",
  ],
  price: [
    "Worth the price",
    "If you have some spare money left",
    "Not recommended",
    "You could also just burn your money",
  ],
  bugs: [
    "Never heard of",
    "Minor bugs",
    "Can get annoying",
    "The game itself is a big terrarium for bugs",
  ],
};

interface Metric {
  month: string;
  count: number;
}

export const TldrYear = () => {
  const { tldrData } = useContext(GameContext) as GameContextType;
  const { selectedGame } = useContext(GameContext);
  const [metricData, setMetricData] = useState<Metric[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [statStatus, setStatStatus] = useState(true);

  useEffect(() => {
    if (!selectedGame) return;

    const fetchTldrData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/steam-charts`,
          {
            params: {
              appid: selectedGame?.appid,
              name: selectedGame?.name,
            },
          },
        );
        setMetricData(response.data);
      } catch (error) {
        setStatStatus(false);
        console.error("Error fetching stat data:", error);
      }
    };

    fetchTldrData();
  }, [selectedGame]);

  const toggleCard = () => {
    setIsOpen((prev) => !prev);
  };

  console.log(metricData);

  const renderCheckboxes = (category: keyof BulletPointSummary) => {
    return bulletPointOptions[category].map((option) => (
      <div key={option} className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-500 rounded-sm cursor-default relative flex items-center justify-center">
          {tldrData.bullet_point_summary[category].includes(option) && (
            <span className="text-white absolute">✓</span>
          )}
        </div>
        <label>{option}</label>
      </div>
    ));
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "S":
        return "text-yellow-500";
      case "A":
        return "text-green-500";
      case "B":
        return "text-lightBlue-500";
      case "C":
        return "text-yellow-400";
      case "D":
        return "text-orange-500";
      case "F":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
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
            <div className="flex justify-center mb-8">
              <Card className="w-[30%]">
                <CardHeader>
                  <CardTitle className="text-center">
                    Bullet Point Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(bulletPointOptions).map((category) => (
                    <div key={category}>
                      <h4 className="text-lg font-semibold">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h4>
                      {renderCheckboxes(category as keyof BulletPointSummary)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col gap-6">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">Pros</CardTitle>
                  </CardHeader>
                  <CardContent>{tldrData.pros}</CardContent>
                </Card>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">
                      Confidence Rating: {tldrData.review_weight}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    A score representing how confident the model is in its
                    review. Smaller niche titles with fewer reviews and feedback
                    are harder for the model to gauge effectively. Any review
                    with a rating below a 6 should be taken with a grain of
                    salt, and you are encouraged to do further analysis on your
                    own.
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">Cons</CardTitle>
                  </CardHeader>
                  <CardContent>{tldrData.cons}</CardContent>
                </Card>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">
                      Notable Mentions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {tldrData.notable_mentions}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-center">
                  Summary Grade:
                  <span
                    className={`px-5 py-5 rounded ${getGradeColor(tldrData.grade)} font-bold inline`}
                  >
                    {tldrData.grade}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>{tldrData.bottom_line_summary}</CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-center">
                  Developer Reputation
                </CardTitle>
              </CardHeader>
              <CardContent>{tldrData.developer_reputation}</CardContent>
            </Card>
            <div className="flex justify-center mb-8">
              <Card className="w-[40%] h-[10%]">
                {statStatus === false ? (
                  <>
                    <CardHeader>
                      <CardTitle className="text-center">
                        Monthly Player Count
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center">
                        Unable to get stats at this time.
                      </p>
                    </CardContent>
                  </>
                ) : selectedGame?.type === "steam" && metricData.length > 0 ? (
                  <>
                    <CardHeader>
                      <CardTitle className="text-center">
                        Monthly Player Count
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={metricData
                            .slice()
                            .reverse()
                            .map((d) => ({ ...d, count: Math.round(d.count) }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) => value.toLocaleString()}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1E293B",
                              borderColor: "#34D399",
                            }}
                            labelStyle={{
                              color: "#34D399",
                              fontWeight: "bold",
                            }}
                            itemStyle={{ color: "white" }}
                            formatter={(value) => value.toLocaleString()}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#34D399"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </>
                ) : (
                  <LoadingScreen text="Loading stats, please wait..." />
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

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
  const isYouTube =
    rawVideoUrl?.includes("youtube.com") || rawVideoUrl?.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

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
