import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { ConfigService } from '@nestjs/config';
import { CardsRepository } from './respositories/cards.repository';
import axios from 'axios';
import * as deckUtils from './utils/deck.utils';
import { ImageApiResponse } from './types/images-api.types';

jest.mock('axios');

describe('CardsService', () => {
  let service: CardsService;
  let configService: jest.Mocked<ConfigService>;
  let cardsRepository: jest.Mocked<CardsRepository>;

  const mockTx = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
        {
          provide: CardsRepository,
          useValue: {
            insertMany: jest.fn(),
            findUnmatchedCardsByGameId: jest.fn(),
            findCardsByGameId: jest.fn(),
            updateCardStatus: jest.fn(),
            hideRevealedCardsByGameId: jest.fn(),
            updateManyCardStatusByGameId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    configService = module.get(ConfigService);
    cardsRepository = module.get(CardsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate and insert shuffled cards', async () => {
    const game = { id: 'g1', userId: 'u1' } as any;

    const apiCards: ImageApiResponse[] = [
      { url: '1', title: 'A' },
      { url: '2', title: 'B' },
      { url: '3', title: 'C' },
    ];

    const selected = [{ uuid: '1', title: 'A' }];
    const duplicated: ImageApiResponse[] = [
      { url: '1', title: 'A' },
      { url: '1', title: 'A' },
    ];
    const shuffled = [...duplicated];

    (configService.getOrThrow as jest.Mock).mockReturnValue('http://api');
    (axios.get as jest.Mock).mockResolvedValue({ data: apiCards });

    jest.spyOn(deckUtils, 'takeCards').mockReturnValue(selected as any);
    jest.spyOn(deckUtils, 'duplicateDeck').mockReturnValue(duplicated as any);
    jest.spyOn(deckUtils, 'shuffleDeck').mockReturnValue(shuffled as any);

    const insertedCards = [{ id: 'c1' }, { id: 'c2' }];
    (cardsRepository.insertMany as jest.Mock).mockResolvedValue(insertedCards);

    const result = await service.generateGameCards(game, 2, mockTx);

    expect(configService.getOrThrow).toHaveBeenCalledWith('IMAGES_API');
    expect(axios.get).toHaveBeenCalledWith('http://api');

    expect(deckUtils.takeCards).toHaveBeenCalledWith(apiCards, 1);
    expect(deckUtils.duplicateDeck).toHaveBeenCalledWith(selected);
    expect(deckUtils.shuffleDeck).toHaveBeenCalledWith(duplicated);

    expect(cardsRepository.insertMany).toHaveBeenCalledWith(
      [
        {
          gameId: 'g1',
          title: 'A',
          imageUrl: '1',
          userId: 'u1',
          position: 0,
        },
        {
          gameId: 'g1',
          title: 'A',
          imageUrl: '1',
          userId: 'u1',
          position: 1,
        },
      ],
      mockTx,
    );

    expect(result).toEqual(insertedCards);
  });

  it('should return unmatched cards', async () => {
    const cards = [{ id: 'c1' }, { id: 'c2' }];
    (cardsRepository.findUnmatchedCardsByGameId as jest.Mock).mockResolvedValue(
      cards,
    );

    const result = await service.getUnmatchedCards('g1', mockTx);

    expect(cardsRepository.findUnmatchedCardsByGameId).toHaveBeenCalledWith(
      'g1',
      mockTx,
    );
    expect(result).toEqual(cards);
  });

  it('should return unmatched cards', async () => {
    const cards = [{ id: 'c1' }, { id: 'c2' }];
    (cardsRepository.findUnmatchedCardsByGameId as jest.Mock).mockResolvedValue(
      cards,
    );

    const result = await service.getUnmatchedCards('g1', mockTx);

    expect(cardsRepository.findUnmatchedCardsByGameId).toHaveBeenCalledWith(
      'g1',
      mockTx,
    );
    expect(result).toEqual(cards);
  });

  it('should return unmatched cards', async () => {
    const cards = [{ id: 'c1' }, { id: 'c2' }];
    (cardsRepository.findUnmatchedCardsByGameId as jest.Mock).mockResolvedValue(
      cards,
    );

    const result = await service.getUnmatchedCards('g1', mockTx);

    expect(cardsRepository.findUnmatchedCardsByGameId).toHaveBeenCalledWith(
      'g1',
      mockTx,
    );
    expect(result).toEqual(cards);
  });
  it('should return unmatched cards', async () => {
    const cards = [{ id: 'c1' }, { id: 'c2' }];
    (cardsRepository.findUnmatchedCardsByGameId as jest.Mock).mockResolvedValue(
      cards,
    );

    const result = await service.getUnmatchedCards('g1', mockTx);

    expect(cardsRepository.findUnmatchedCardsByGameId).toHaveBeenCalledWith(
      'g1',
      mockTx,
    );
    expect(result).toEqual(cards);
  });

  it('should throw if no revealed cards to hide', async () => {
    (cardsRepository.hideRevealedCardsByGameId as jest.Mock).mockResolvedValue(
      [],
    );

    await expect(service.hideRevealedCards('g1', mockTx)).rejects.toThrow(
      'No revealed cards to hide',
    );
  });

  it('should match two cards', async () => {
    const matched = [
      { id: 'c1', status: 'match' },
      { id: 'c2', status: 'match' },
    ];

    (
      cardsRepository.updateManyCardStatusByGameId as jest.Mock
    ).mockResolvedValue(matched);

    const result = await service.matchRevealedCards('g1', ['c1', 'c2'], mockTx);

    expect(cardsRepository.updateManyCardStatusByGameId).toHaveBeenCalledWith(
      'g1',
      ['c1', 'c2'],
      'match',
      mockTx,
    );

    expect(result).toEqual(matched);
  });

  it('should throw if matched cards length is not 2', async () => {
    (
      cardsRepository.updateManyCardStatusByGameId as jest.Mock
    ).mockResolvedValue([{ id: 'c1', status: 'match' }]);

    await expect(
      service.matchRevealedCards('g1', ['c1', 'c2'], mockTx),
    ).rejects.toThrow('Expected 2 cards');
  });
});
