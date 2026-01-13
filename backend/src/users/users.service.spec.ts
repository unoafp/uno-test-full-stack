import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

beforeAll(() => {
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockCreateUserDto = {
    name: 'Juan',
    rut: '12345678-9',
  };

  const mockUserEntity: Partial<User> = {
    id: '1',
    name: 'Juan',
    rut: '12345678-9',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ===================== CREATE ===================== */

  it('should create a user successfully', async () => {
    userRepository.create.mockReturnValue(mockUserEntity as User);
    userRepository.save.mockResolvedValue(mockUserEntity as User);

    const result = await service.create(mockCreateUserDto);

    expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    expect(userRepository.save).toHaveBeenCalledWith(mockUserEntity);
    expect(result).toBe('The user has been registered successfully');
  });

  it('should throw BadRequestException when duplicate user exists', async () => {
    userRepository.create.mockReturnValue(mockUserEntity as User);
    userRepository.save.mockRejectedValue({
      code: '23505',
      detail: 'User already exists',
    });

    await expect(service.create(mockCreateUserDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    userRepository.create.mockReturnValue(mockUserEntity as User);
    userRepository.save.mockRejectedValue(new Error('DB error'));

    await expect(service.create(mockCreateUserDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  /* ===================== LOGIN USER ===================== */

  it('should return user when rut exists', async () => {
    userRepository.findOne.mockResolvedValue(mockUserEntity as User);

    const result = await service.LoginUser('12345678-9');

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { rut: '12345678-9' },
    });
    expect(result).toEqual(mockUserEntity);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(service.LoginUser('12345678-9')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.LoginUser('12345678-9')).rejects.toThrow(
      'User with rut: 12345678-9 not exist',
    );

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { rut: '12345678-9' },
    });
  });
});
