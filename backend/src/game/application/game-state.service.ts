import { Injectable } from '@nestjs/common';
import { FlipCardDto } from '../dto/flip-card.dto';
import { GameResultDto } from '../dto/game-result.dto';
import { CardDto } from '../dto/card.dto';

@Injectable()
export class GameStateService {
  private deck: CardDto[] = [];
  private flippedCards: CardDto[] = [];
  private matchedPairs = 0;
  private totalMoves = 0;

  setDeck(deck: CardDto[]) {
    this.deck = deck;
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalMoves = 0;
  }

  flipCard(flip: FlipCardDto): GameResultDto {
    const card = this.deck.find((c) => c.id === flip.cardId);
    if (!card || card.flipped) {
      return this.getResult();
    }

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.totalMoves++;
      const [first, second] = this.flippedCards;
      if (first.image.uuid === second.image.uuid) {
        this.matchedPairs++;
      } else {
        first.flipped = false;
        second.flipped = false;
      }
      this.flippedCards = [];
    }

    return this.getResult();
  }

  private getResult(): GameResultDto {
    return {
      matchedPairs: this.matchedPairs,
      totalMoves: this.totalMoves,
      completed: this.matchedPairs === this.deck.length / 2,
    };
  }
}
