import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useContext, useEffect } from "react";
import { GameContext} from "../context/context";
import { BulletPointSummary } from "../types/types"
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getGradeColor, bulletPointOptions } from "../utils/bulletPointOptions";
import { fetchSteamChartData } from "@/services/apiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { LoadingScreen } from "./LoadingScreen";

interface Metric {
  month: string;
  count: number;
}

export const TldrYear = () => {
  const { tldrData } = useContext(GameContext);
  const { selectedGame } = useContext(GameContext);
  const [metricData, setMetricData] = useState<Metric[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [statStatus, setStatStatus] = useState(true);

  useEffect(() => {
    if (!selectedGame) return;

    const fetchTldrData = async () => {
      try {
        const data = await fetchSteamChartData(selectedGame.appid, selectedGame.name);
        if(data === 0) {
          setStatStatus(false);
        }
        console.log(data)
        setMetricData(data);
      } catch (error) {
        setStatStatus(false);
      }
    };

    fetchTldrData();
  }, [selectedGame]);

  const toggleCard = () => {
    setIsOpen((prev) => !prev);
  };

  const renderCheckboxes = (category: keyof BulletPointSummary) => {
    return bulletPointOptions[category].map((option) => (
      <div key={option} className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-500 rounded-sm cursor-default relative flex items-center justify-center">
          {tldrData?.bullet_point_summary[category].includes(option) && (
            <span className="text-white absolute">✓</span>
          )}
        </div>
        <label>{option}</label>
      </div>
    ));
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
                  <CardContent>{tldrData?.pros}</CardContent>
                </Card>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">
                      Confidence Rating: {tldrData?.review_weight}
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
                  <CardContent>{tldrData?.cons}</CardContent>
                </Card>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-center">
                      Notable Mentions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {tldrData?.notable_mentions}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-center">
                  Summary Grade:
                  <span
                   className={`px-5 py-5 rounded ${getGradeColor(tldrData?.grade ?? 'Unknown')} font-bold inline`}
                  >
                    {tldrData?.grade}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>{tldrData?.bottom_line_summary}</CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-center">
                  Developer Reputation
                </CardTitle>
              </CardHeader>
              <CardContent>{tldrData?.developer_reputation}</CardContent>
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
                              color: "#fff",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#34D399"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle className="text-center">
                        Monthly Player Count
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LoadingScreen text="Loading, please wait..."/>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};