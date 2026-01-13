import { Controller, Get } from '@nestjs/common';
import { SeedCardsService } from './seed-cards.service';

@Controller('seed-cards')
export class SeedCardsController {
  constructor(private readonly seedCardsService: SeedCardsService) {}

  @Get()
  async executed() {
    await this.seedCardsService.execute();
    return 'Seed has been executed succefully';
  }
}
