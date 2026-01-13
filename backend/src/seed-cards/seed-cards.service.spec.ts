import { Test, TestingModule } from '@nestjs/testing';
import { SeedCardsService } from './seed-cards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cards } from './entities/cards.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { HttpAdapter } from 'src/common/interfaces/http-adapter.interface';

describe('SeedCardsService', () => {
  let service: SeedCardsService;
  let cardsRepository: jest.Mocked<Repository<Cards>>;
  let httpAdapter: jest.Mocked<HttpAdapter>;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  const mockApiResponse = [
    {
      url: 'http://image-1',
      title: 'Card 1',
      content_type: 'image/jpeg',
    },
    {
      url: 'http://image-2',
      title: 'Card 2',
      content_type: 'image/png',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedCardsService,
        {
          provide: getRepositoryToken(Cards),
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: 'HttpAdapter',
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeedCardsService>(SeedCardsService);
    cardsRepository = module.get(getRepositoryToken(Cards));
    httpAdapter = module.get('HttpAdapter');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch cards from API and upsert them into database', async () => {
    httpAdapter.get.mockResolvedValue(mockApiResponse as any);
    cardsRepository.upsert.mockResolvedValue(undefined as any);

    await service.execute();

    expect(httpAdapter.get).toHaveBeenCalledWith(
      'https://challenge-uno.vercel.app/api/images',
    );

    expect(cardsRepository.upsert).toHaveBeenCalledWith(
      [
        {
          imageUrl: 'http://image-1',
          title: 'Card 1',
          contentType: 'image/jpeg',
        },
        {
          imageUrl: 'http://image-2',
          title: 'Card 2',
          contentType: 'image/png',
        },
      ],
      {
        conflictPaths: ['imageUrl'],
      },
    );
  });
});
