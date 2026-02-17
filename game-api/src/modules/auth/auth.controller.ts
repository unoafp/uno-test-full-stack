import {
  Controller,
  Post,
  Body,
  Res,
  Inject,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserIdentifier } from './application/identifier';
import { UserNotFoundError } from './domain/errors';
import type { SessionStore } from '../../shared/infractucture/session/session.store';
import { SessionAuthGuard } from '../../shared/infractucture/session/session.guard';
import { UserGetter } from './application/getter';
import { SESSION_STORE } from '../../shared/infractucture/session/session.token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly identifier: UserIdentifier,
    private readonly getter: UserGetter,

    @Inject(SESSION_STORE)
    private readonly sessionStore: SessionStore,
  ) {}

  @Post('identify')
  async identify(
    // TODO : validate body with class-validator
    @Body() body: { name: string; run: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.identifier.execute(body);

    const sessionId = this.sessionStore.create(user.id, user.name, user.run);

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return user;
  }

  @UseGuards(SessionAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { userId?: string }) {
    const userId = req.userId;

    if (userId == null) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.getter.execute({ id: userId });

      return user;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }
}
