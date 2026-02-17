import {
  Injectable,
  CanActivate,
  Inject,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { SessionStore } from './session.store';
import { SESSION_STORE } from './session.token';
import { Request } from 'express';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    @Inject(SESSION_STORE)
    private readonly sessionStore: SessionStore,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<
        Request & { userId?: string; userName?: string; userRun?: string }
      >();
    const cookies = req.cookies;

    const sessionId = cookies['sessionId'] as unknown;

    if (typeof sessionId !== 'string') throw new UnauthorizedException();

    if (!sessionId) throw new UnauthorizedException();

    const user = this.sessionStore.getUser(sessionId);
    if (!user) throw new UnauthorizedException();

    req.userId = user.id;
    req.userName = user.name;
    req.userRun = user.run;
    return true;
  }
}
