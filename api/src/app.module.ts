import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './database/drizzle.module';
import { AuthModule } from './features/auth/auth.module';
import { CardsModule } from './features/cards/cards.module';
import { GameModule } from './features/game/game.module';
import { StatsModule } from './features/stats/stats.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    DrizzleModule,
    CardsModule,
    GameModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
