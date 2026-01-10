import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  const mockGameService = {
    initializeGame: jest.fn(),
    saveResult: jest.fn(),
    getHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        { provide: GameService, useValue: mockGameService },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should start game', async () => {
      await controller.startGame({ username: 'test', run: '123' });
      expect(service.initializeGame).toHaveBeenCalledWith('test', '123');
  });

  it('should save result', async () => {
      await controller.saveResult({ userId: 'u1', win: true, moves: 10, time: 100 });
      expect(service.saveResult).toHaveBeenCalledWith('u1', true, 10, 100);
  });
  
  it('should get history', async () => {
      await controller.getHistory('123');
      expect(service.getHistory).toHaveBeenCalledWith('123');
  });
});
