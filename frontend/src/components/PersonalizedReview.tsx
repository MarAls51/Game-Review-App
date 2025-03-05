import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PersonalizedReview = () => {
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
        noted from your connected Steam, Microsoft, or Epic Games accounts.
      </h3>

      <div className="flex flex-wrap justify-center gap-8">
        <Card className="w-full sm:w-1/2 lg:w-1/3">
          <CardHeader>
            <CardTitle className="text-center">
              How Your Games Compare
            </CardTitle>
          </CardHeader>
          <CardContent>{"filler."}</CardContent>
        </Card>

        <Card className="w-full sm:w-1/2 lg:w-1/3">
          <CardHeader>
            <CardTitle className="text-center">Personal TLDR</CardTitle>
          </CardHeader>
          <CardContent>{"filler."}</CardContent>
        </Card>
      </div>

      <Card className="w-full lg:w-3/4 mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Comprehensive Personalized Review
          </CardTitle>
        </CardHeader>
        <CardContent>{"filler."}</CardContent>
      </Card>
    </section>
  );
};
