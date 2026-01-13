import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from './entities/cards.entity';
import { Repository } from 'typeorm';
import { CardsResponse } from './interfaces/cards-response.interface';
import type { HttpAdapter } from 'src/common/interfaces/http-adapter.interface';

@Injectable()
export class SeedCardsService {
  constructor(
    @InjectRepository(Cards)
    private readonly cardsRepository: Repository<Cards>,
    @Inject('HttpAdapter')
    private readonly http: HttpAdapter,
  ) {}

  async execute(): Promise<void> {
    const data = await this.http.get<CardsResponse[]>(
      'https://challenge-uno.vercel.app/api/images',
    );

    /* This function updates and inserts data into the cards table, 
        inserting new records and updating existing ones. */
    await this.cardsRepository.upsert(
      data.map((apiCard) => ({
        imageUrl: apiCard.url,
        title: apiCard.title,
        contentType: apiCard.content_type,
      })),
      {
        conflictPaths: ['imageUrl'],
      },
    );
  }
}
