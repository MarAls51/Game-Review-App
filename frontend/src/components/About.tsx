import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt="Pilot Image"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                About{" "}
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  Us
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Welcome to our humble community, we bring together the best
                insights about the games you love. Our goal is to provide a
                comprehensive, unbiased, as well as personalized experience that
                helps you make informed decisions while{" "}
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  filtering out all the bullshit.
                </span>
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-2xl font-bold">Why us?</h3>
              <ul className="list-disc pl-6 mt-4 space-y-4">
                {" "}
                {/* Added space-y-4 here */}
                <li>
                  <strong>Comprehensive Data Aggregation:</strong> We combine
                  reviews and data from multiple sources like Steam, YouTube,
                  Reddit, Metacritic, and utilize{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    ML algorithms
                  </span>{" "}
                  to give you a complete view of each game in one place.
                </li>
                <li>
                  <strong>Personalized Recommendations:</strong> Based on your
                  play history and preferences, we offer tailored game scores to
                  help you discover new games that match your interests.
                </li>
                <li>
                  <strong>TLDR & In-Depth Reviews:</strong> Get quick,
                  digestible summaries or dive deep into the details with
                  extensive reviews that suit your reading preference.
                </li>
                <li>
                  <strong>Similarity Index:</strong> We provide insights into
                  how games in your library compare to new titles you're
                  interested in, helping you choose games with similar themes or
                  gameplay styles.
                </li>
                <li>
                  <strong>Company Reputation Scoring:</strong> We also assess
                  game developers and publishers based on their track record,
                  offering you valuable information on the creators behind your
                  favorite games.
                </li>
                <li>
                  <strong>Historical Review Breakdown:</strong> View reviews
                  segmented by year, so you can see how a game has evolved and
                  been received over time.
                </li>
                <li>
                  <strong>Data Visualizations:</strong> Our graphs display key
                  stats like average playtimes, player count trends, and more to
                  give you a clear understanding of game trends and longevity.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
