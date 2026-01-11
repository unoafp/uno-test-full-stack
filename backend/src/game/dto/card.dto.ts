import { ImageDto } from './image.dto';

export class CardDto {
  id: string;
  image: ImageDto;
  flipped: boolean;
}
