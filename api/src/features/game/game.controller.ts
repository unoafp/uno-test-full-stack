import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GetCurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUser } from '../auth/strategies/jwt.strategy';
import { IsAuthenticated } from '../auth/decorators/is-authenticated.decorator';
import { CreateNewGameDto } from './dto/create-new-game.dto copy';
import { RevealCardDto } from './dto/pick-card.dto';

@Controller('game')
@IsAuthenticated()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('new')
  createNewGame(
    @Body() dto: CreateNewGameDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.gameService.createNewGame(dto, user);
  }

  @Get('current')
  getCurrentGame(@GetCurrentUser() user: CurrentUser) {
    return this.gameService.getCurrentGame(user);
  }

  @Post('current/reveal')
  pickCard(@Body() dto: RevealCardDto, @GetCurrentUser() user: CurrentUser) {
    return this.gameService.revealCard(dto, user);
  }
}
