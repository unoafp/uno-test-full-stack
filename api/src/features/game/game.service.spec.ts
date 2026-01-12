import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@nestjs/config';
import { DRIZZLE_MAIN } from 'src/database/drizzle.constants';
import { CardsService } from '../cards/cards.service';
import { GameService } from './game.service';
import { GamesRepository } from './repositories/games.repository';
import { CurrentUser } from '../auth/strategies/jwt.strategy';
import { BadRequestException } from '@nestjs/common';
const hidden = (id: string, imageId = 'img1') => ({
  id,
  imageId,
  status: 'hidden',
});

const revealed = (id: string, imageId = 'img1') => ({
  id,
  imageId,
  status: 'revealed',
});

describe('GameService', () => {
  let service: GameService;

  const mockDb = {
    transaction: jest.fn(),
  };

  const mockCardsService = {
    generateGameCards: jest.fn(),
    getUnmatchedCards: jest.fn(),
    getGameCards: jest.fn(),
    revealCard: jest.fn(),
    hideRevealedCards: jest.fn(),
    matchRevealedCards: jest.fn(),
  };

  const mockGamesRepository = {
    countActiveGames: jest.fn(),
    create: jest.fn(),
    findCurrentGame: jest.fn(),
    registerMove: jest.fn(),
    registerFinalMove: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: CardsService, useValue: mockCardsService },
        { provide: GamesRepository, useValue: mockGamesRepository },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: DRIZZLE_MAIN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new game when there is no active game', async () => {
    const user = { sub: 'user-1' } as CurrentUser;
    const dto = { totalCards: 4 };

    const fakeGame = { id: 'game-1', userId: 'user-1' };
    const fakeCards = [{ id: 'card-1' }];

    mockDb.transaction.mockImplementation(async (cb) => cb('tx'));

    mockGamesRepository.countActiveGames.mockResolvedValue(0);
    mockGamesRepository.create.mockResolvedValue(fakeGame);
    mockCardsService.generateGameCards.mockResolvedValue(fakeCards);

    const result = await service.createNewGame(dto as any, user);

    expect(mockGamesRepository.countActiveGames).toHaveBeenCalledWith(
      'user-1',
      'tx',
    );
    expect(mockGamesRepository.create).toHaveBeenCalledWith('user-1', 4, 'tx');
    expect(mockCardsService.generateGameCards).toHaveBeenCalledWith(
      fakeGame,
      4,
      'tx',
    );
    expect(result).toEqual({
      game: fakeGame,
      cards: fakeCards.map(expect.anything),
    });
  });

  it('should throw if there is already an active game', async () => {
    const user = { sub: 'user-1' } as CurrentUser;
    const dto = { totalCards: 4 };

    mockDb.transaction.mockImplementation(async (cb) => cb('tx'));
    mockGamesRepository.countActiveGames.mockResolvedValue(1);

    await expect(service.createNewGame(dto as any, user)).rejects.toThrow(
      'There is already an active game',
    );
  });

  it('should return current game and cards', async () => {
    const user = { sub: 'user-1' } as CurrentUser;
    const fakeGame = { id: 'game-1', userId: 'user-1' };
    const fakeCards = [{ id: 'card-1', status: 'hidden' }];

    mockDb.transaction.mockImplementation(async (cb) => cb('tx'));
    mockGamesRepository.findCurrentGame.mockResolvedValue(fakeGame);
    mockCardsService.getGameCards = jest.fn().mockResolvedValue(fakeCards);

    const result = await service.getCurrentGame(user);

    expect(mockGamesRepository.findCurrentGame).toHaveBeenCalledWith(
      'user-1',
      'tx',
    );
    expect(result.game).toEqual(fakeGame);
    expect(result.cards).toBeDefined();
  });

  it('throws if there is no active game', async () => {
    mockGamesRepository.findCurrentGame.mockResolvedValue(null);

    await expect(
      service.revealCard({ cardId: 'c1' }, { sub: 'user-1' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if picked card is not hidden or does not exist', async () => {
    const game = { id: 'g1' };

    mockGamesRepository.findCurrentGame.mockResolvedValue(game);
    mockCardsService.getUnmatchedCards.mockResolvedValue([revealed('c1')]);

    await expect(
      service.revealCard({ cardId: 'c1' }, { sub: 'user-1' } as any),
    ).rejects.toThrow('Card is not pickeable');
  });
  it('throws if there is more than one revealed card', async () => {
    const game = { id: 'g1' };

    mockGamesRepository.findCurrentGame.mockResolvedValue(game);
    mockCardsService.getUnmatchedCards.mockResolvedValue([
      revealed('c1'),
      revealed('c2'),
      hidden('c3'),
    ]);

    await expect(
      service.revealCard({ cardId: 'c3' }, { sub: 'user-1' } as any),
    ).rejects.toThrow('Data error');
  });

  it('reveals card when no other cards are revealed', async () => {
    const game = { id: 'g1' };
    const card = hidden('c1');

    mockGamesRepository.findCurrentGame.mockResolvedValue(game);
    mockCardsService.getUnmatchedCards.mockResolvedValue([card]);
    mockCardsService.revealCard.mockResolvedValue({
      ...card,
      status: 'revealed',
    });

    const result = await service.revealCard({ cardId: 'c1' }, {
      sub: 'user-1',
    } as any);

    expect(mockCardsService.revealCard).toHaveBeenCalledWith(
      'c1',
      expect.anything(),
    );
    expect(result.cards[0].status).toBe('revealed');
  });

  it('reveals card when no other cards are revealed', async () => {
    const game = { id: 'g1' };
    const card = hidden('c1');

    mockGamesRepository.findCurrentGame.mockResolvedValue(game);
    mockCardsService.getUnmatchedCards.mockResolvedValue([card]);
    mockCardsService.revealCard.mockResolvedValue({
      ...card,
      status: 'revealed',
    });

    const result = await service.revealCard({ cardId: 'c1' }, {
      sub: 'user-1',
    } as any);

    expect(mockCardsService.revealCard).toHaveBeenCalledWith(
      'c1',
      expect.anything(),
    );
    expect(result.cards[0].status).toBe('revealed');
  });

  it('matches cards and registers successful move', async () => {
    const game = { id: 'g1' };
    const revealedCard = revealed('c1', 'img1');
    const pickedCard = hidden('c2', 'img1');

    mockGamesRepository.findCurrentGame.mockResolvedValue(game);
    mockCardsService.getUnmatchedCards.mockResolvedValue([
      revealedCard,
      pickedCard,
      hidden('c3'),
    ]);

    mockGamesRepository.registerMove.mockResolvedValue([
      { id: 'g1', moves: 2, errors: 0 },
    ]);

    mockCardsService.matchRevealedCards.mockResolvedValue([
      { ...revealedCard, status: 'match' },
      { ...pickedCard, status: 'match' },
    ]);

    const result = await service.revealCard({ cardId: 'c2' }, {
      sub: 'user-1',
    } as any);

    expect(mockGamesRepository.registerMove).toHaveBeenCalledWith(
      'g1',
      true,
      expect.anything(),
    );
    expect(result.cards.every((c) => c.status === 'match')).toBe(true);
  });
  it('matches cards and registers successful move', async () => {
    const game = { id: 'g1' };
    const revealedCard = revealed('c1', 'img1');
    const pickedCard = hidden('c2', 'img1');

    mockGamesRepository.findCurrentGame.mockResolvedValue(game);
    mockCardsService.getUnmatchedCards.mockResolvedValue([
      revealedCard,
      pickedCard,
      hidden('c3'),
    ]);

    mockGamesRepository.registerMove.mockResolvedValue([
      { id: 'g1', moves: 2, errors: 0 },
    ]);

    mockCardsService.matchRevealedCards.mockResolvedValue([
      { ...revealedCard, status: 'match' },
      { ...pickedCard, status: 'match' },
    ]);

    const result = await service.revealCard({ cardId: 'c2' }, {
      sub: 'user-1',
    } as any);

    expect(mockGamesRepository.registerMove).toHaveBeenCalledWith(
      'g1',
      true,
      expect.anything(),
    );
    expect(result.cards.every((c) => c.status === 'match')).toBe(true);
  });
});
