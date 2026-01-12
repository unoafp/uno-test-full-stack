import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './database/drizzle.module';
import { ConcentrationModule } from './features/concentration/concentration.module';
import { AuthModule } from './features/auth/auth.module';
import { CardsModule } from './features/cards/cards.module';
import { DecksModule } from './features/decks/decks.module';
import { GameModule } from './features/game/game.module';
import { StatsModule } from './features/stats/stats.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    DrizzleModule,
    ConcentrationModule,
    CardsModule,
    DecksModule,
    GameModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
