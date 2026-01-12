import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { CurrentUser } from '../auth/strategies/jwt.strategy';

describe('StatsController', () => {
  let statsController: StatsController;
  let statsService: StatsService;

  const mockStatsService = {
    getPastResults: jest.fn(),
  };

  const fakeUser = {
    sub: 'user-123',
  } as CurrentUser;

  const fakeResults = [
    { id: 'game1', moves: 10, errors: 2, status: 'finished' },
    { id: 'game2', moves: 8, errors: 0, status: 'finished' },
  ];

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

    statsController = module.get<StatsController>(StatsController);
    statsService = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => {
    expect(statsController).toBeDefined();
  });

  describe('getPastResults', () => {
    it('should call statsService.getPastResults with the user and return results', async () => {
      mockStatsService.getPastResults.mockResolvedValue(fakeResults);

      const result = await statsController.getPastResults(fakeUser);

      expect(statsService.getPastResults).toHaveBeenCalledWith(fakeUser);
      expect(result).toEqual(fakeResults);
    });
  });
});
