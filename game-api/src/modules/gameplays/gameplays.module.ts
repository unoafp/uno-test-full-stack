import { Module } from '@nestjs/common';

import { SessionModule } from '../../shared/infractucture/session/session.module';
import { GameplaysController } from './gameplays.controller';
import { GameGenerator } from './application/game-generator';
import { ApiCardContentProvider } from './infractucture/api/card-content-provider';
import { CARD_CONTENT_PROVIDER } from './gameplays.tokens';
import { CardContentProvider } from './application/card-content-provider';

@Module({
  imports: [SessionModule],
  providers: [
    ApiCardContentProvider,
    {
      provide: CARD_CONTENT_PROVIDER,
      useClass: ApiCardContentProvider,
    },
    {
      provide: GameGenerator,
      useFactory: (provider: CardContentProvider) =>
        new GameGenerator(provider),
      inject: [CARD_CONTENT_PROVIDER],
    },
  ],
  exports: [GameGenerator],
  controllers: [GameplaysController],
})
export class GameplaysModule {}
