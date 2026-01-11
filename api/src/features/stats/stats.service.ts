import { Injectable } from '@nestjs/common';
import { GamesRepository } from '../game/repositories/games.repository';
import { CurrentUser } from '../auth/strategies/jwt.strategy';

@Injectable()
export class StatsService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async getPastResults(user: CurrentUser) {
    return this.gamesRepository.findFinishedGamesByUserId(user.sub);
  }
}
