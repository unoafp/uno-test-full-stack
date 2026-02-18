import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GameResultRecoder } from './application/game-result-recoder';
import { SessionAuthGuard } from 'src/shared/infractucture/session/session.guard';

@Controller('game-results')
export class GameResultsController {
  constructor(private readonly recoder: GameResultRecoder) {}

  @UseGuards(SessionAuthGuard)
  @Post()
  async save(
    @Body()
    body: {
      correctPairs: number;
      totalPairs: number;
      failedAttempts: number;
    },
    @Req()
    req: Request & { userId: string; userName: string; userRun: string },
  ) {
    return this.recoder.execute({
      playerName: req.userName,
      playerRun: req.userRun,
      ...body,
    });
  }
}
