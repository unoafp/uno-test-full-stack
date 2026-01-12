import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GetCurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUser } from '../auth/strategies/jwt.strategy';
import { IsAuthenticated } from '../auth/decorators/is-authenticated.decorator';

@Controller('stats')
@IsAuthenticated()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('past-results')
  getPastResults(@GetCurrentUser() user: CurrentUser) {
    return this.statsService.getPastResults(user);
  }

  @Get(':id')
  getGameResult(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.statsService.getGameResult(id, user);
  }
}
