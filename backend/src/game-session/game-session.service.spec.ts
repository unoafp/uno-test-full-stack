import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionService } from './game-session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameSession } from './entities/game-session.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { GameResult } from './enums/game-results.enum';

describe('GameSessionService', () => {
  let service: GameSessionService;
  let gameSessionRepository: jest.Mocked<Repository<GameSession>>;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  const mockCreateGameSessionDto: CreateGameSessionDto = {
    idUser: '12345678-9',
    finishedAt: '2026-01-09T01:45:00.000Z',
    resultGame: GameResult.WIN,
    hits: 10,
    errors: 2,
    codeDeck: 'deck-001',
  };

  const mockUser = { rut: '12345678-9' } as User;
  const mockGameSession = { id: 'session-1', user: mockUser } as GameSession;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionService,
        {
          provide: getRepositoryToken(GameSession),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameSessionService>(GameSessionService);
    gameSessionRepository = module.get(getRepositoryToken(GameSession));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ===================== CREATE ===================== */
  it('should create and save a game session successfully', async () => {
    userRepository.findOne.mockResolvedValue(mockUser);
    gameSessionRepository.create.mockReturnValue(mockGameSession);
    gameSessionRepository.save.mockResolvedValue(mockGameSession);

    const result = await service.create(mockCreateGameSessionDto);

    expect(result).toBe('the registered game has been saved successfully');
    expect(() =>
      userRepository.findOne({ where: { rut: '12345678-9' } }),
    ).not.toThrow();
    expect(() => gameSessionRepository.create(mockGameSession)).not.toThrow();
    expect(() => gameSessionRepository.save(mockGameSession)).not.toThrow();
  });

  it('should throw BadRequestException on duplicate key error', async () => {
    userRepository.findOne.mockResolvedValue(mockUser);
    gameSessionRepository.create.mockReturnValue(mockGameSession);
    gameSessionRepository.save.mockRejectedValue({ code: '23505' });

    await expect(async () => {
      await service.create(mockCreateGameSessionDto);
    }).rejects.toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException on unknown DB error', async () => {
    userRepository.findOne.mockResolvedValue(mockUser);
    gameSessionRepository.create.mockReturnValue(mockGameSession);
    gameSessionRepository.save.mockRejectedValue(new Error('DB error'));

    await expect(async () => {
      await service.create(mockCreateGameSessionDto);
    }).rejects.toThrow(InternalServerErrorException);
  });

  /* ===================== FIND BY RUT ===================== */
  it('should return game sessions by user rut', async () => {
    gameSessionRepository.find.mockResolvedValue([mockGameSession]);

    const result = await service.findByRut('12345678-9');

    expect(result).toHaveLength(1);
    expect(() =>
      gameSessionRepository.find({
        where: { user: { rut: '12345678-9' } },
        relations: ['user'],
      }),
    ).not.toThrow();
  });
});
