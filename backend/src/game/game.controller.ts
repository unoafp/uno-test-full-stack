import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Post('start')
    async startGame(@Body() body: { username: string; run: string }) {
        return this.gameService.initializeGame(body.username, body.run);
    }

    @Post('result')
    async saveResult(@Body() body: { userId: string; win: boolean; moves: number; time: number }) {
        return this.gameService.saveResult(body.userId, body.win, body.moves, body.time);
    }

    @Get('history/:run')
    async getHistory(@Param('run') run: string) {
        return this.gameService.getHistory(run);
    }
}
