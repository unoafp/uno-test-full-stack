import { Injectable } from '@nestjs/common';
import { GameModel } from '../game/schemas/game.schema';
import { ConfigService } from '@nestjs/config';
import { ImageApiResponse } from './types/images-api.types';
import axios from 'axios';
import { DrizzleTx } from 'src/database/types';
import { duplicateDeck, shuffleDeck, takeCards } from './utils/deck.utils';
import { type CardInsertModel } from './schemas/card.schema';
import { CardsRepository } from './respositories/cards.repository';

@Injectable()
export class CardsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cardsRepository: CardsRepository,
  ) {}

  async generateGameCards(game: GameModel, totalCards: number, tx: DrizzleTx) {
    const pairs = totalCards / 2;
    const apiUrl = this.configService.getOrThrow<string>('IMAGES_API');
    const cardsList = await axios
      .get<ImageApiResponse[]>(apiUrl)
      .then((res) => res.data);

    const selectedCards = takeCards(cardsList, pairs);
    const fullDeck = duplicateDeck(selectedCards);
    const finalDeck = shuffleDeck(fullDeck);

    const items: CardInsertModel[] = finalDeck.map((card, idx) => ({
      gameId: game.id,
      title: card.title,
      imageId: card.uuid,
      userId: game.userId,
      position: idx,
    }));

    const cards = await this.cardsRepository.insertMany(items, tx);
    return cards;
  }

  async getUnmatchedCards(gameId: string, tx: DrizzleTx) {
    return await this.cardsRepository.findUnmatchedCardsByGameId(gameId, tx);
  }

  async getGameCards(gameId: string, tx: DrizzleTx) {
    return await this.cardsRepository.findCardsByGameId(gameId, tx);
  }
  async revealCard(cardId: string, tx: DrizzleTx) {
    const updatedCard = await this.cardsRepository.updateCardStatus(
      cardId,
      'revealed',
      tx,
    );
    if (!updatedCard) throw new Error('Card not found');

    return updatedCard;
  }

  async hideRevealedCards(gameId: string, tx: DrizzleTx) {
    const updatedCards = await this.cardsRepository.hideRevealedCardsByGameId(
      gameId,
      tx,
    );

    if (updatedCards.length === 0) {
      throw new Error('No revealed cards to hide');
    }

    return updatedCards;
  }
  async matchRevealedCards(
    gameId: string,
    cardsId: [string, string],
    tx: DrizzleTx,
  ) {
    const matchedCards =
      await this.cardsRepository.updateManyCardStatusByGameId(
        gameId,
        cardsId,
        'match',
        tx,
      );
    if (matchedCards.length !== 2) {
      throw new Error('Expected 2 cards');
    }

    return matchedCards;
  }
}
