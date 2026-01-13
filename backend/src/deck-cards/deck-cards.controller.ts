import { Controller, Get } from '@nestjs/common';
import { DeckCardsService } from './deck-cards.service';

@Controller('deck-cards')
export class DeckCardsController {
  constructor(private readonly deckCardsService: DeckCardsService) {}

  @Get()
  findAll() {
    return this.deckCardsService.generateDeck();
  }
}
