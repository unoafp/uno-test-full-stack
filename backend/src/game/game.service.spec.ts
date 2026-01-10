import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  gameResult: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

global.fetch = jest.fn();

describe('GameService', () => {
  let service: GameService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeGame', () => {
    it('should create a new user and return deck', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [
            { uuid: '1', url: 'u1', title: 't1' },
            { uuid: '2', url: 'u2', title: 't2' },
            { uuid: '3', url: 'u3', title: 't3' },
            { uuid: '4', url: 'u4', title: 't4' },
            { uuid: '5', url: 'u5', title: 't5' },
            { uuid: '6', url: 'u6', title: 't6' }
        ],
      });

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'u1', username: 'test', run: '123' });

      const result = await service.initializeGame('test', '123');
      expect(prisma.user.create).toHaveBeenCalledWith({ data: { username: 'test', run: '123' } });
      expect(result.deck).toHaveLength(12); // 6 pairs
    });

    it('should update user if username changes', async () => {
       (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => Array(6).fill({ uuid: '1', url: 'u1', title: 't1' }),
      });

      prisma.user.findUnique.mockResolvedValue({ id: 'u1', username: 'old', run: '123' });
      prisma.user.update.mockResolvedValue({ id: 'u1', username: 'new', run: '123' });

      await service.initializeGame('new', '123');
      expect(prisma.user.update).toHaveBeenCalled();
    });
    
    it('should throw error if fetch fails', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 'u1', username: 'test', run: '123' });
        (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
        
        await expect(service.initializeGame('test', '123')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('saveResult', () => {
     it('should save game result', async () => {
         prisma.gameResult.create.mockResolvedValue({ id: 'g1' });
         await service.saveResult('u1', true, 10, 100);
         expect(prisma.gameResult.create).toHaveBeenCalledWith({
             data: { userId: 'u1', win: true, moves: 10, time: 100 }
         });
     });
  });

  describe('getHistory', () => {
      it('should return empty array if user not found', async () => {
          prisma.user.findUnique.mockResolvedValue(null);
          const res = await service.getHistory('123');
          expect(res).toEqual([]);
      });

      it('should return history', async () => {
          prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
          prisma.gameResult.findMany.mockResolvedValue([{ id: 'g1' }]);
          const res = await service.getHistory('123');
          expect(res).toEqual([{ id: 'g1' }]);
      });
  });
});
