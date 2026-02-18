export type GameCard = {
  id: number;
  url: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const [cards, setCards] = useState<GameCard[]>(() => createDeck());
const [flippedIds, setFlippedIds] = useState<number[]>([]);
const [attempts, setAttempts] = useState(0);
const [correctPairs, setCorrectPairs] = useState(0);
const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
const [isChecking, setIsChecking] = useState(false);

export type GameplayStore = {
  cards: GameCard[];
  attemps: number;
  flippedIds: [string, string];
  correctPairs: number;
  gameStatus: GameStatus;
};

export interface GameResult {
  id: string;
  playerName: string;
  playerNickname: string;
  totalPairs: number;
  correctPairs: number;
  attempts: number;
  maxAttempts: number;
  won: boolean;
  date: string;
}

export type GameStatus = "playing" | "won" | "lost";
