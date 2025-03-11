import { BulletPointSummary } from "../types/types";

export const bulletPointOptions: Record<keyof BulletPointSummary, string[]> = {
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


export const getGradeColor = (grade: string) => {
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