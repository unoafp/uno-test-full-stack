import { Test } from '@nestjs/testing';
import { UserIdentifier } from './application/identifier';
import { AuthController } from './auth.controller';
import { UserRepository } from './domain/repository';
import { User } from './domain/user';

describe('AuthController', () => {
  let controller: AuthController;

  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    userRepositoryMock = {
      FindByRun: jest.fn(),
      Save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserIdentifier,
          useFactory: () => new UserIdentifier(userRepositoryMock),
        },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
  });

  describe('Identify', () => {
    it('should identify a user successfully', async () => {
      userRepositoryMock.FindByRun.mockResolvedValue(null);
      userRepositoryMock.Save.mockResolvedValue(undefined);

      const body = { name: 'John Doe', run: '12345678-9' };

      const result = await controller.identify(body);

      expect(result).toMatchObject({
        name: 'John Doe',
        run: '12345678-9',
      });
    });

    it('should throw a ConflictException if user already exists', async () => {
      const user = new User('1', '12345678-9', 'Existing User');
      userRepositoryMock.FindByRun.mockResolvedValue(user);

      const body = { name: 'John Doe', run: '12345678-9' };

      await expect(controller.identify(body)).rejects.toThrow(
        'User already exists',
      );
    });
  });
});
