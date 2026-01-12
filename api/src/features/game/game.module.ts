import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GamesRepository } from './repositories/games.repository';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [CardsModule],
  controllers: [GameController],
  providers: [GameService, GamesRepository],
})
export class GameModule {}
