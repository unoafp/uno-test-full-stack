import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{7,8}-[0-9kK]$/, {
        message: 'rut must be valid (e.g. 12345678-9)',
    })
    rut: string;

}