import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { BuildDeckService } from './application/build-deck.service';
import { ImageApiService } from './infrastructure/image-api.service';

@Module({
  controllers: [GameController],
  providers: [BuildDeckService, ImageApiService],
})
export class GameModule {}
