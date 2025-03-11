import { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameContext } from "../context/context";
import { LoadingScreen } from "@/components/LoadingScreen";

export const DeepDive = () => {
  const { tldrData } = useContext(GameContext);

  if (!tldrData) {
    return <LoadingScreen text="Loading results, please wait..." />;
  }

  return (
    <section id="testimonials" className="text-center container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        Your{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Deep Dive{" "}
        </span>
        review
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Full in-depth review with detailed explanations on what the game has to
        offer, taken directly from steam reviews, metacritic, pc gamer, and other
        sources.
      </p>

      <Card className="w-4/5 mx-auto text-left">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {tldrData.deep_dive.title}
          </CardTitle>
        </CardHeader>
        <CardContent>{tldrData.deep_dive.content}</CardContent>
      </Card>
    </section>
  );
};
