import { Controller, Get, Post, Body } from '@nestjs/common';
import { BuildDeckService } from './application/build-deck.service';
import { GameStateService } from './application/game-state.service';
import { FlipCardDto } from './dto/flip-card.dto';
import { GameResultDto } from './dto/game-result.dto';
import { CardDto } from './dto/card.dto';

@Controller('game')
export class GameController {
  constructor(
    private readonly buildDeckService: BuildDeckService,
    private readonly gameStateService: GameStateService,
  ) {}

  @Get('deck')
  async getDeck(): Promise<CardDto[]> {
    const deck = await this.buildDeckService.execute();
    (this.gameStateService as GameStateService).setDeck(deck); // cast seguro
    return deck;
  }

  @Post('flip')
  flipCard(@Body() flip: FlipCardDto): GameResultDto {
    return this.gameStateService.flipCard(flip);
  }
}
