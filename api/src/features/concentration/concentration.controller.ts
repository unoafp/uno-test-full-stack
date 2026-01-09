import { Controller, Post, Body } from '@nestjs/common';
import { ConcentrationService } from './concentration.service';
import { IsAuthenticated } from '../auth/decorators/is-authenticated.decorator';
import { GetCurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUser } from '../auth/strategies/jwt.strategy';
import { CreateNewGameDto } from './dto/new-game.dto';

@Controller('concentration')
@IsAuthenticated()
export class ConcentrationController {
  constructor(private readonly concentrationService: ConcentrationService) {}

  @Post('new')
  create(
    @Body() createConcentrationDto: CreateNewGameDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.concentrationService.generateNewDeck(
      createConcentrationDto,
      user,
    );
  }
}
