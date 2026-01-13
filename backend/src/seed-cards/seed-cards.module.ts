import { Module } from '@nestjs/common';
import { SeedCardsService } from './seed-cards.service';
import { SeedCardsController } from './seed-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './entities/cards.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Cards])],
  controllers: [SeedCardsController],
  providers: [SeedCardsService],
})
export class SeedCardsModule {}
