import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsRut } from '../validators/is-rut.validator';

export class LoginDto {
  @IsNotEmpty()
  @IsRut({ message: 'Invalid rut' })
  @ApiProperty({
    type: 'string',
    description: 'User rut',
    example: '12.345.678-5, 12345678-5 or 123456785',
  })
  rut: string;
}
