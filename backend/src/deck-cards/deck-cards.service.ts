import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from 'src/seed-cards/entities/cards.entity';
import { Repository } from 'typeorm';
import { deckCards } from './interfaces/deck-cards.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeckCardsService {
  constructor(
    @InjectRepository(Cards)
    private readonly cardsRepository: Repository<Cards>,
  ) {}

  async generateDeck(): Promise<deckCards[]> {
    const deckCode = uuidv4();

    const cards = await this.cardsRepository.find();

    function makeNewDeck(card: Cards): deckCards {
      return {
        id: card.id,
        code_Deck: deckCode,
        created_at: new Date(),
        title: card.title,
        url_img: card.imageUrl,
        match: false,
        position: 0,
      };
    }

    // Duplicate pairs
    const deck: deckCards[] = cards.flatMap((card) => [
      makeNewDeck(card),
      makeNewDeck(card),
    ]);

    // Fisher–Yates algorithm to shuffle cards
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Assign random positions from 1 to N (e.g., 1 to 40)
    deck.forEach((card, index) => {
      card.position = index + 1;
    });

    return deck;
  }
}
