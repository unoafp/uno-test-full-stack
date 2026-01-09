import { ApiProperty } from '@nestjs/swagger';
import { IsDivisibleBy, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateNewGameDto {
  @IsNotEmpty()
  @IsNumber()
  @IsDivisibleBy(2, { message: 'totalCards must be an even number' })
  @ApiProperty({
    type: 'number',
    description: 'Number of cards (must be even)',
    example: 4,
  })
  totalCards: number;
}
