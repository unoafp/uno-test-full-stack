import { GameResult } from './game-result';

type ListGameResultsOptions = {
  limit?: number;
  offset?: number;
};

interface GameResultRepository {
  save: (gameResult: GameResult) => Promise<void>;
  listByRun: (
    run: string,
    options?: ListGameResultsOptions,
  ) => Promise<GameResult[]>;
}

export type { GameResultRepository };
