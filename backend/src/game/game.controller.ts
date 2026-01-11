import { Controller, Get } from '@nestjs/common';
import { BuildDeckService } from './application/build-deck.service';
import { CardDto } from './dto/card.dto';

@Controller('game')
export class GameController {
  constructor(private readonly buildDeckService: BuildDeckService) {}

  @Get('deck')
  getDeck(): Promise<CardDto[]> {
    return this.buildDeckService.execute();
  }
}
