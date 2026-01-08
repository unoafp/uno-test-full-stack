import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsRut } from '../validators/is-rut.validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsRut({ message: 'Invalid rut' })
  @ApiProperty({
    type: 'string',
    description: 'User rut',
    example: '12345678-9',
  })
  rut: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'User name',
    example: 'John Doe',
  })
  name: string;
}
