import { Injectable } from '@nestjs/common';
import { CardDto } from '../dto/card.dto';
import { ImageApiService } from '../infrastructure/image-api.service';

@Injectable()
export class BuildDeckService {
  constructor(private readonly imageApi: ImageApiService) {}

  async execute(): Promise<CardDto[]> {
    const images = await this.imageApi.getImages();

    const selected = images.slice(0, 8);

    const duplicated: CardDto[] = selected.flatMap((image, index) => [
      {
        id: `${index}-a`,
        image,
        flipped: false,
      },
      {
        id: `${index}-b`,
        image,
        flipped: false,
      },
    ]);

    return this.shuffle(duplicated);
  }

  private shuffle(cards: CardDto[]): CardDto[] {
    return cards.sort(() => Math.random() - 0.5);
  }
}
