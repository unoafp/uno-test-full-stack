import {
  Injectable,
  CanActivate,
  Inject,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionStore } from './session.store';
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
      .getRequest<Request & { userId?: string }>();
    const cookies = req.cookies;

    const sessionId = cookies['sessionId'] as unknown;

    if (typeof sessionId !== 'string') throw new UnauthorizedException();

    if (!sessionId) throw new UnauthorizedException();

    const userId = this.sessionStore.getUser(sessionId);
    if (!userId) throw new UnauthorizedException();

    req.userId = userId;
    return true;
  }
}
