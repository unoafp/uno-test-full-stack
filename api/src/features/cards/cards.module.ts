import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsRepository } from './respositories/cards.repository';

@Module({
  providers: [CardsService, CardsRepository],
  exports: [CardsService],
})
export class CardsModule {}
