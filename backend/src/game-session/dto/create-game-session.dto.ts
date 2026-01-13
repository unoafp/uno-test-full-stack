import { IsDateString, IsEnum, IsInt, IsPositive, IsUUID } from 'class-validator';
import { GameResult } from '../enums/game-results.enum';
import { Transform } from 'class-transformer';


export class CreateGameSessionDto {

    @IsUUID()
    idUser: string;

    @IsDateString()
    finishedAt: string;

    @Transform(({ value }) => value?.toUpperCase())
    @IsEnum(GameResult, 
        { message: 'resultGame must be WIN, LOSE or SURRENDER' }
    )
    resultGame: GameResult;

    @IsInt()
    @IsPositive()
    hits: number;

    @IsInt()
    @IsPositive()
    errors: number;

    @IsUUID()
    codeDeck: string;
}