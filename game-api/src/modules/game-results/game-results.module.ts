import { Module } from '@nestjs/common';

import { SessionModule } from '../../shared/infractucture/session/session.module';

import { GameResultsController } from './game-reults.controller';
import { InMemoryGameResultsRepository } from './infrastructure/persistence/inmem/game-results-repository';
import { GAME_RESULT_REPOSITORY } from './game-results.token';
import { GameResultRecoder } from './application/game-result-recoder';
import { GameResultRepository } from './domain/game-result-repository';

@Module({
  imports: [SessionModule],
  providers: [
    InMemoryGameResultsRepository,
    {
      provide: GAME_RESULT_REPOSITORY,
      useClass: InMemoryGameResultsRepository,
    },
    {
      provide: GameResultRecoder,
      useFactory: (repo: GameResultRepository) => new GameResultRecoder(repo),
      inject: [GAME_RESULT_REPOSITORY],
    },
  ],
  exports: [GameResultRecoder],
  controllers: [GameResultsController],
})
export class GameResultsModule {}
