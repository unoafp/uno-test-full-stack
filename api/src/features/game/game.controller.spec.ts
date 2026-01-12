import { Test, TestingModule } from '@nestjs/testing';
import { CreateNewGameDto } from './dto/create-new-game.dto copy';
import { RevealCardDto } from './dto/pick-card.dto';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { CurrentUser } from '../auth/strategies/jwt.strategy';

describe('GameController', () => {
  let controller: GameController;
  let service: jest.Mocked<GameService>;

  const mockGameService = {
    createNewGame: jest.fn(),
    getCurrentGame: jest.fn(),
    revealCard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call gameService.createNewGame', async () => {
    const dto: CreateNewGameDto = { totalCards: 4 };
    const user = { sub: 'user-1' } as CurrentUser;

    const expectedResult = { game: { id: 'g1' }, cards: [] };
    service.createNewGame.mockResolvedValue(expectedResult as any);

    const result = await controller.createNewGame(dto, user);

    expect(service.createNewGame).toHaveBeenCalledWith(dto, user);
    expect(result).toEqual(expectedResult);
  });

  it('should call gameService.getCurrentGame', async () => {
    const user = { sub: 'user-1' } as CurrentUser;

    const expectedResult = { game: { id: 'g1' }, cards: [] };
    service.getCurrentGame.mockResolvedValue(expectedResult as any);

    const result = await controller.getCurrentGame(user);

    expect(service.getCurrentGame).toHaveBeenCalledWith(user);
    expect(result).toEqual(expectedResult);
  });

  it('should call gameService.revealCard', async () => {
    const dto: RevealCardDto = { cardId: 'card-1' };
    const user = { sub: 'user-1' } as CurrentUser;

    const expectedResult = { game: { id: 'g1' }, cards: [] };
    service.revealCard.mockResolvedValue(expectedResult as any);

    const result = await controller.pickCard(dto, user);

    expect(service.revealCard).toHaveBeenCalledWith(dto, user);
    expect(result).toEqual(expectedResult);
  });
});
