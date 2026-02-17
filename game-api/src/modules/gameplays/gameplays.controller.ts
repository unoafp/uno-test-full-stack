import { Controller, Post, UseGuards } from '@nestjs/common';

import { SessionAuthGuard } from '../../shared/infractucture/session/session.guard';
import { GameGenerator } from './application/game-generator';

@Controller('gameplays')
export class GameplaysController {
  constructor(private readonly generator: GameGenerator) {}

  @UseGuards(SessionAuthGuard)
  @Post('start')
  async start() {
    return this.generator.execute();
  }
}
