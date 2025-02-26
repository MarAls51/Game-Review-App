import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const DeepDive = () => {
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
        Full in-depth review with detailed explanations on what the game has to offer. From the DLCs, to high-level gameplay, and everything in between.
      </p>

      <Card className="w-4.1/5 mx-auto text-left">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Baldur's Gate: A Timeless RPG Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Introduction</strong>
            <br />
            Few RPGs hold the legacy and influence that <em>Baldur’s Gate</em> does. Developed by BioWare and released in 1998, it set the standard for narrative-driven, party-based role-playing games inspired by the Dungeons & Dragons universe. This review explores the core aspects that make <em>Baldur’s Gate</em> a timeless classic and a must-play for any RPG enthusiast.
          </p>
          <p>
            <strong>Storyline and World-Building</strong>
            <br />
            The narrative of <em>Baldur’s Gate</em> is deeply intertwined with the Forgotten Realms setting. Players step into the shoes of a protagonist whose origins are shrouded in mystery. Raised in the fortress-library of Candlekeep, the protagonist is thrust into a chaotic world after the murder of their foster father, Gorion. This sets the stage for an epic journey filled with political intrigue, ancient prophecies, and moral dilemmas.
            <br />
            The game’s writing is exceptional, blending grand storytelling with personal character arcs. Every town, dungeon, and wilderness area is brimming with lore, making exploration rewarding. The NPCs react to the player's choices, reinforcing the feeling of a living, breathing world.
          </p>
          <p>
            <strong>Gameplay and Mechanics</strong>
            <br />
            <em>Baldur’s Gate</em> utilizes the Advanced Dungeons & Dragons (AD&D) 2nd Edition ruleset, offering deep and tactical combat. Players control a party of up to six characters, each with their own strengths, weaknesses, and unique personalities. The pause-and-play combat system allows for strategic planning, making encounters both challenging and satisfying.
            <br />
            Character progression is one of the game’s strongest points. Players can create a protagonist from multiple races and classes, customizing their attributes, skills, and moral alignment. The party members, such as Minsc and his miniature giant space hamster, Boo, add depth and humor, making every adventure memorable.
          </p>
          <p>
            <strong>Graphics and Sound</strong>
            <br />
            Although the original 1998 release featured pre-rendered environments and sprite-based character models, the art style remains charming. The Enhanced Edition, released by Beamdog, refines the visuals while keeping the classic aesthetic intact. The hand-painted backgrounds and atmospheric lighting bring the Forgotten Realms to life.
            <br />
            The soundtrack by Michael Hoenig is another highlight, with sweeping orchestral compositions that elevate the game’s grandeur. Voice acting is limited but impactful, with iconic lines that have cemented themselves in RPG history.
          </p>
          <p>
            <strong>Replayability and Player Choice</strong>
            <br />
            One of <em>Baldur’s Gate</em>’s greatest strengths is its replayability. The branching story paths, moral choices, and party compositions allow for multiple playthroughs with vastly different experiences. Players can align themselves with noble causes or embrace a darker path, influencing how NPCs and factions react.
            <br />
            The game also features numerous side quests that expand the lore and provide unique rewards. These range from simple fetch quests to intricate storylines that rival the main plot. This depth ensures that every playthrough feels fresh.
          </p>
          <p>
            <strong>Legacy and Influence</strong>
            <br />
            The impact of <em>Baldur’s Gate</em> on the RPG genre cannot be overstated. It laid the foundation for later classics like <em>Neverwinter Nights</em>, <em>Dragon Age</em>, and <em>Pillars of Eternity</em>. Its emphasis on storytelling, tactical combat, and player agency has inspired countless developers.
            <br />
            The Enhanced Edition has introduced the game to a new generation, with improved mechanics and additional content that complements the original experience. Its ability to stand the test of time speaks volumes about its quality.
          </p>
          <p>
            <strong>Conclusion</strong>
            <br />
            <em>Baldur’s Gate</em> remains one of the most significant RPGs ever made. Its compelling story, intricate gameplay mechanics, and unforgettable characters make it a must-play for fans of the genre. Whether you're a newcomer or a returning adventurer, the journey through the Sword Coast is one worth taking.
            <br />
            For those seeking a deep, rewarding RPG experience that respects player choice and strategy, <em>Baldur’s Gate</em> is an essential entry in gaming history.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
