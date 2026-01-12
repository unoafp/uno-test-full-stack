import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { GamesRepository } from '../game/repositories/games.repository';

@Module({
  controllers: [StatsController],
  providers: [StatsService, GamesRepository],
})
export class StatsModule {}
