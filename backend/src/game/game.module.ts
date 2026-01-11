import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { BuildDeckService } from './application/build-deck.service';
import { GameStateService } from './application/game-state.service';
import { ImageApiService } from './infrastructure/image-api.service';

@Module({
  controllers: [GameController],
  providers: [BuildDeckService, ImageApiService, GameStateService],
})
export class GameModule {}
