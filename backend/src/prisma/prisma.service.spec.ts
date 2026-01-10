import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

// Mock PrismaClient to bypass constructor validation
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      $connect = jest.fn();
      $disconnect = jest.fn();
    },
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    // Process env setup not strictly needed if mocked, but good practice
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect on module init', async () => {
    // Mock $connect
    jest.spyOn(service as any, '$connect').mockImplementation(async () => {});
    await service.onModuleInit();
    expect((service as any).$connect).toHaveBeenCalled();
  });

  it('should disconnect on module destroy', async () => {
    // Mock $disconnect
    jest.spyOn(service as any, '$disconnect').mockImplementation(async () => {});
    await service.onModuleDestroy();
    expect((service as any).$disconnect).toHaveBeenCalled();
  });
});
