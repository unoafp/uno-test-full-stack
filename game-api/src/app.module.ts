import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GameplaysModule } from './modules/gameplays/gameplays.module';
import { GameResultsModule } from './modules/game-results/game-results.module';

@Module({
  imports: [AuthModule, GameplaysModule, GameResultsModule],
})
export class AppModule {}
