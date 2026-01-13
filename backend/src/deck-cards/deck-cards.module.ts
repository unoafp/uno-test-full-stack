import { Module } from '@nestjs/common';
import { DeckCardsService } from './deck-cards.service';
import { DeckCardsController } from './deck-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from 'src/seed-cards/entities/cards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cards])],
  controllers: [DeckCardsController],
  providers: [DeckCardsService],
})
export class DeckCardsModule {}
