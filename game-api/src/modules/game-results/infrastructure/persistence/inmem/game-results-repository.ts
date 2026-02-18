import { Injectable } from '@nestjs/common';
import { GameResult } from 'src/modules/game-results/domain/game-result';
import { GameResultRepository } from 'src/modules/game-results/domain/game-result-repository';

@Injectable()
export class InMemoryGameResultsRepository implements GameResultRepository {
  private results: GameResult[] = [];

  save(result: GameResult): Promise<void> {
    this.results.push(result);
    return Promise.resolve();
  }

  listByRun(
    run: string,
    options?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<GameResult[]> {
    const results = this.results.filter(
      (result) => result.getPlayerRun() === run,
    );

    const offset = options?.offset || 0;
    const limit = options?.limit || 10;

    return Promise.resolve(results.slice(offset, offset + limit));
  }
}
