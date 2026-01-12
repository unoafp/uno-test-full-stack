import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CurrentUser } from '../auth/strategies/jwt.strategy';
import { DRIZZLE_MAIN } from 'src/database/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CardsService } from '../cards/cards.service';
import { ConfigService } from '@nestjs/config';
import { GamesRepository } from './repositories/games.repository';
import { CardModel } from '../cards/schemas/card.schema';
import { toPublicCard } from '../cards/utils/deck.utils';
import { DrizzleTx } from 'src/database/types';
import { GameModel } from './schemas/game.schema';
import { CreateNewGameDto } from './dto/create-new-game.dto copy';
import { RevealCardDto } from './dto/pick-card.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cardsService: CardsService,
    @Inject(DRIZZLE_MAIN) private readonly db: NodePgDatabase,
    private readonly gamesRepository: GamesRepository,
  ) {}
  async createNewGame(dto: CreateNewGameDto, user: CurrentUser) {
    const { totalCards } = dto;
    const result = await this.db.transaction(async (tx) => {
      const count = await this.gamesRepository.countActiveGames(user.sub, tx);
      if (count > 0)
        throw new BadRequestException('There is already an active game');

      const game = await this.gamesRepository.create(user.sub, totalCards, tx);
      const cards = await this.cardsService.generateGameCards(
        game,
        totalCards,
        tx,
      );

      return { game, cards };
    });

    return result;
  }

  async getCurrentGame(user: CurrentUser) {
    const result = await this.db.transaction(async (tx) => {
      const game = await this.gamesRepository.findCurrentGame(user.sub, tx);
      if (!game) throw new BadRequestException('Not active game found');

      const rawCards = await this.cardsService.getUnmatchedCards(game.id, tx);
      const cards = rawCards.map(toPublicCard);
      return { game, cards };
    });
    return result;
  }

  async revealCard(dto: RevealCardDto, user: CurrentUser) {
    const { cardId } = dto;

    const result = await this.db.transaction(async (tx) => {
      const game = await this.gamesRepository.findCurrentGame(user.sub, tx);
      if (!game) throw new BadRequestException('Not active game found');

      const unmatchedCards = await this.cardsService.getUnmatchedCards(
        game.id,
        tx,
      );

      const pickedCard = unmatchedCards.find(
        (card) => card.id === cardId && card.status === 'hidden',
      );
      if (!pickedCard) throw new BadRequestException('Card is not pickeable');

      const revealedCards = unmatchedCards.filter(
        (card) => card.status === 'revealed',
      );

      if (revealedCards.length > 1) throw new BadRequestException('Data error');

      if (revealedCards.length === 0) {
        return await this.resolveRevealCard(game, pickedCard, tx);
      }
      const revealedCard = revealedCards[0];
      const isSameImage =
        revealedCard && pickedCard.imageId === revealedCard.imageId;

      if (isSameImage === false) {
        return await this.resolveUnmach(game, pickedCard, tx);
      }

      if (unmatchedCards.length > 2)
        return this.resolveMatch(game, [pickedCard, revealedCard], tx);

      return this.resolveFinishGame(game, [pickedCard, revealedCard], tx);
    });

    return result;
  }
  async resolveRevealCard(
    game: GameModel,
    pickedCard: CardModel,
    tx: DrizzleTx,
  ) {
    const updatedCard = await this.cardsService.revealCard(pickedCard.id, tx);
    return {
      game,
      cards: [updatedCard],
    };
  }
  async resolveUnmach(game: GameModel, pickedCard: CardModel, tx: DrizzleTx) {
    const [prevCard] = await this.cardsService.hideRevealedCards(game.id, tx);
    const [updatedGame] = await this.gamesRepository.registerMove(
      game.id,
      false,
      tx,
    );

    return {
      cards: [prevCard, pickedCard],
      game: updatedGame,
    };
  }

  async resolveMatch(
    game: GameModel,
    cards: [CardModel, CardModel],
    tx: DrizzleTx,
  ) {
    const [updatedGame] = await this.gamesRepository.registerMove(
      game.id,
      true,
      tx,
    );

    const updatedCards = await this.cardsService.matchRevealedCards(
      game.id,
      [cards[0].id, cards[1].id],
      tx,
    );
    return {
      cards: updatedCards,
      game: updatedGame,
    };
  }
  async resolveFinishGame(
    game: GameModel,
    cards: [CardModel, CardModel],
    tx: DrizzleTx,
  ) {
    const updatedCards = await this.cardsService.matchRevealedCards(
      game.id,
      [cards[0].id, cards[1].id],
      tx,
    );
    const [updatedGame] = await this.gamesRepository.registerFinalMove(
      game.id,
      tx,
    );

    return {
      cards: updatedCards,
      game: updatedGame,
    };
  }
}
