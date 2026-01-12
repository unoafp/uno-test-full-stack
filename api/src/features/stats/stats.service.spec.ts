import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { CurrentUser } from '../auth/strategies/jwt.strategy';

describe('StatsController', () => {
  let controller: StatsController;
  let service: StatsService;

  const mockStatsService = {
    getPastResults: jest.fn(),
  };

  const fakeUser: CurrentUser = {
    sub: 'user-123',
  } as CurrentUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: mockStatsService,
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    service = module.get<StatsService>(StatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPastResults', () => {
    it('should call statsService.getPastResults with current user', async () => {
      const fakeResult = [
        { id: 'game-1', moves: 10, errors: 2 },
        { id: 'game-2', moves: 8, errors: 1 },
      ];

      mockStatsService.getPastResults.mockResolvedValue(fakeResult);

      const result = await controller.getPastResults(fakeUser);

      expect(service.getPastResults).toHaveBeenCalledTimes(1);
      expect(service.getPastResults).toHaveBeenCalledWith(fakeUser);
      expect(result).toEqual(fakeResult);
    });
  });
});
