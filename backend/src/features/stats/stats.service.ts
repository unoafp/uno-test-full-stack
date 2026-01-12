import { Inject, Injectable } from '@nestjs/common';
import { CurrentUser } from '../auth/strategies/jwt.strategy';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_MAIN } from 'src/database/drizzle.constants';
import { GameService } from '../game/game.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly gamesService: GameService,
    @Inject(DRIZZLE_MAIN) private readonly db: NodePgDatabase,
  ) {}

  async getPastResults(user: CurrentUser) {
    return this.gamesService.getPastResults(user);
  }

  async getGameResult(gameId: string, user: CurrentUser) {
    return this.gamesService.getGameResult(gameId, user);
  }
}
