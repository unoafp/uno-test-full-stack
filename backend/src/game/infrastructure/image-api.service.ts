import { Injectable } from '@nestjs/common';
import { ImageDto } from '../dto/image.dto';

@Injectable()
export class ImageApiService {
  async getImages(): Promise<ImageDto[]> {
    const response = await fetch('https://challenge-uno.vercel.app/api/images');

    const data = (await response.json()) as ImageDto[];

    return data;
  }
}
