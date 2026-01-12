import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GetCurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUser } from '../auth/strategies/jwt.strategy';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('past-results')
  getPastResults(@GetCurrentUser() user: CurrentUser) {
    return this.statsService.getPastResults(user);
  }
}
