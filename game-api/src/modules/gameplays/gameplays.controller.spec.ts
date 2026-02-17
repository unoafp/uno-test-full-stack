import { Test } from '@nestjs/testing';
import { GameplaysController } from './gameplays.controller';
import { GameGenerator } from './application/game-generator';
import { CardContentProvider } from './application/card-content-provider';
import { SESSION_STORE } from '../../shared/infractucture/session/session.token';
import { SessionStore } from '../../shared/infractucture/session/session.store';

describe('GameplaysController', () => {
  let controller: GameplaysController;

  let cardProviderMock: jest.Mocked<CardContentProvider>;

  let storeMock: jest.Mocked<SessionStore>;

  beforeEach(async () => {
    cardProviderMock = {
      getCardContents: jest.fn(),
    };

    storeMock = {
      create: jest.fn(),
      getUser: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [GameplaysController],
      providers: [
        {
          provide: GameGenerator,
          useFactory: () => new GameGenerator(cardProviderMock),
        },
        {
          provide: SESSION_STORE,
          useFactory: () => storeMock,
        },
      ],
    }).compile();

    controller = moduleRef.get(GameplaysController);
  });

  describe('start', () => {
    it('should start a new game successfully', async () => {
      const mockContents = [
        { id: '1', title: 'Card 1', url: 'http://example.com/card1' },
        { id: '2', title: 'Card 2', url: 'http://example.com/card2' },
      ];

      cardProviderMock.getCardContents.mockResolvedValue(mockContents);

      const result = await controller.start();

      expect(cardProviderMock.getCardContents).toHaveBeenCalledWith(10);
      expect(result.getDeck()).toHaveLength(4); // 2 pairs
    });
  });
});
