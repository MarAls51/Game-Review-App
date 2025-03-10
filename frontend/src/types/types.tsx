export type BulletPointSummary = {
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
  
  export type DeepDive = {
    title: string;
    content: string;
  };
  
  export type TldrData = {
    bullet_point_summary: BulletPointSummary;
    pros: string;
    cons: string;
    notable_mentions: string;
    grade: string;
    bottom_line_summary: string;
    developer_reputation: string;
    review_weight: string;
    deep_dive: DeepDive;
  };
  
  export type Game = {
    type: string;
    appid: any;
    name: string;
    description: string;
    screenshots: any;
    movies: any;
  }
  
  export type GameContextType = {
    selectedGame: Game | null;
    setSelectedGame: (game: Game | null) => void;
    tldrData: TldrData | null;
    personalizedReview: any;
    loading: boolean;
  }
  
  export type ConnectedAccounts = {
    steam: string;
    microsoft: string;
    playstation: string;
  };
  