import { useContext } from "react";
import { GameContext } from "../context/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingScreen } from "../components/LoadingScreen";

export const PersonalizedReview = () => {
  const { personalizedReview } = useContext(GameContext);

  return (
    <section id="pricing" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Your
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Personalized{" "}
        </span>
        Review
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Detailed review based on your specific playstyle and gameplay history as
        noted from your connected Steam and Microsoft accounts.
      </h3>
      {!personalizedReview ? (
        <section id="pricing" className="container py-24 sm:py-32 space-y-8">
          <LoadingScreen text="Please wait as we generate the review..." />
        </section>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-8">
            <Card className="w-full sm:w-1/2 lg:w-1/3">
              <CardHeader>
                <CardTitle className="text-center">
                  How Your Games Compare
                </CardTitle>
              </CardHeader>
              <CardContent>
                {personalizedReview.comparison ||
                  "No comparison data available."}
              </CardContent>
            </Card>
          </div>
          <Card className="w-full lg:w-3/4 mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                Comprehensive Personalized Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personalizedReview.review || "No review available."}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
};
