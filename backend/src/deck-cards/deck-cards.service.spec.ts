import { Test, TestingModule } from '@nestjs/testing';
import { DeckCardsService } from './deck-cards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cards } from 'src/seed-cards/entities/cards.entity';
import { Repository } from 'typeorm';

describe('DeckCardsService', () => {
  let service: DeckCardsService;
  let cardsRepository: jest.Mocked<Repository<Cards>>;

  const mockCards: Cards[] = [
    {
      id: 'card-1',
      imageUrl: 'http://image-1',
      title: 'Card 1',
      contentType: 'image/jpeg',
    },
    {
      id: 'card-2',
      imageUrl: 'http://image-2',
      title: 'Card 2',
      contentType: 'image/jpeg',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckCardsService,
        {
          provide: getRepositoryToken(Cards),
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DeckCardsService>(DeckCardsService);
    cardsRepository = module.get(getRepositoryToken(Cards));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a deck with duplicated pairs', async () => {
    cardsRepository.find.mockResolvedValue(mockCards);

    const deck = await service.generateDeck();
    expect(deck).toHaveLength(mockCards.length * 2);
  });

  it('should assign the same deck code to all cards', async () => {
    cardsRepository.find.mockResolvedValue(mockCards);

    const deck = await service.generateDeck();
    const deckCode = deck[0].code_Deck;
    deck.forEach((card) => expect(card.code_Deck).toBe(deckCode));
  });

  it('should initialize all cards with match = false', async () => {
    cardsRepository.find.mockResolvedValue(mockCards);

    const deck = await service.generateDeck();
    deck.forEach((card) => expect(card.match).toBe(false));
  });

  it('should assign sequential positions starting from 1', async () => {
    cardsRepository.find.mockResolvedValue(mockCards);

    const deck = await service.generateDeck();
    const positions = deck.map((card) => card.position);
    expect(positions).toEqual(
      Array.from({ length: deck.length }, (_, i) => i + 1),
    );
  });

  it('should create two cards for each original card', async () => {
    cardsRepository.find.mockResolvedValue(mockCards);

    const deck = await service.generateDeck();
    const idsCount = deck.reduce<Record<string, number>>((acc, card) => {
      acc[card.id] = (acc[card.id] || 0) + 1;
      return acc;
    }, {});
    Object.values(idsCount).forEach((count) => expect(count).toBe(2));
  });
});
