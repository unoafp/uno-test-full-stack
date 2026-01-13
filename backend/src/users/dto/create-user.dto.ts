import { IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @Matches(/^\d{7,8}-[0-9Kk]$/, {
    message:
      'El RUT debe tener 7 u 8 dígitos seguidos de un guion y un dígito verificador (0-9 o K)',
  })
  rut: string;
}
