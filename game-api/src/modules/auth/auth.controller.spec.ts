import { Test } from '@nestjs/testing';
import { UserIdentifier } from './application/identifier';
import { AuthController } from './auth.controller';
import { UserRepository } from './domain/repository';
import { User } from './domain/user';
import { Response } from 'express';
import { UserGetter } from './application/getter';
import { SESSION_STORE } from '../../shared/infractucture/session/session.token';
import type { SessionStore } from '../../shared/infractucture/session/session.store';

describe('AuthController', () => {
  let controller: AuthController;

  let userRepositoryMock: jest.Mocked<UserRepository>;

  let storeMock: jest.Mocked<SessionStore>;

  beforeEach(async () => {
    userRepositoryMock = {
      FindByRun: jest.fn(),
      Save: jest.fn(),
      Find: jest.fn(),
    };

    storeMock = {
      create: jest.fn(),
      getUser: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserIdentifier,
          useFactory: () => new UserIdentifier(userRepositoryMock),
        },
        {
          provide: UserGetter,
          useFactory: () => new UserGetter(userRepositoryMock),
        },
        {
          provide: SESSION_STORE,
          useFactory: () => storeMock,
        },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
  });

  describe('Identify', () => {
    it('should identify a user successfully', async () => {
      userRepositoryMock.FindByRun.mockResolvedValue(null);
      userRepositoryMock.Save.mockResolvedValue(undefined);
      storeMock.create.mockReturnValue('mock-session-id');

      const body = { name: 'John Doe', run: '12345678-9' };

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.identify(body, response);

      expect(userRepositoryMock.FindByRun).toHaveBeenCalledWith(body.run);
      expect(userRepositoryMock.Save).toHaveBeenCalledWith(expect.any(User));
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(response.cookie).toHaveBeenCalledWith(
        'sessionId',
        'mock-session-id',
        {
          httpOnly: true,
          sameSite: 'lax',
        },
      );
      expect(storeMock.create).toHaveBeenCalled();

      expect(result).toMatchObject({
        name: 'John Doe',
        run: '12345678-9',
      });
    });

    it('should return user  if user already exists', async () => {
      const user = new User('1', '12345678-9', 'Existing User');
      userRepositoryMock.FindByRun.mockResolvedValue(user);
      storeMock.create.mockReturnValue('mock-session-id');

      const body = { name: 'Existing User', run: '12345678-9' };

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.identify(body, response);

      expect(userRepositoryMock.FindByRun).toHaveBeenCalledWith(body.run);
      expect(userRepositoryMock.Save).not.toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(response.cookie).toHaveBeenCalledWith(
        'sessionId',
        'mock-session-id',
        {
          httpOnly: true,
          sameSite: 'lax',
        },
      );
      expect(storeMock.create).toHaveBeenCalled();

      expect(result).toMatchObject({
        name: 'Existing User',
        run: '12345678-9',
      });
    });
  });

  describe('Me', () => {
    it('should return user data if session is valid', async () => {
      const user = new User('1', '12345678-9', 'John Doe');

      userRepositoryMock.Find.mockResolvedValue(user);

      const req = { userId: '1' } as unknown as Request & { userId?: string };

      const result = await controller.me(req);

      expect(userRepositoryMock.Find).toHaveBeenCalledWith('1');
      expect(result).toMatchObject({
        id: user.getId(),
        run: user.getRun(),
        name: user.getName(),
      });
    });

    it('should throw an UnauthorizedException if session is invalid', async () => {
      userRepositoryMock.Find.mockResolvedValue(null);

      const req = { userId: 'non-existent-id' } as unknown as Request & {
        userId?: string;
      };

      await expect(controller.me(req)).rejects.toThrow('Unauthorized');
    });
  });
});
