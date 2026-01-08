// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export function hasIntersection<T>(array1: T[], array2: T[]): boolean {
  const set1 = new Set(array1);
  return array2.some((item) => set1.has(item));
}
import {
  AUTH_DECORATOR_KEY,
  AuthObject,
  AuthOptions,
} from '../decorators/is-authenticated.decorator';

@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const controller = context.getClass();

    const authRequired =
      this.reflector.get<AuthOptions>(AUTH_DECORATOR_KEY, handler) ||
      this.reflector.get<AuthOptions>(AUTH_DECORATOR_KEY, controller);

    if (!authRequired) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groups = user?.groups || [];

    if (Array.isArray(authRequired)) {
      return authRequired.length === 0 || hasIntersection(groups, authRequired);
    }

    const { allowedRoles, requiredRoles, prohibitedRoles } =
      authRequired as AuthObject;

    if (prohibitedRoles && hasIntersection(groups, prohibitedRoles)) {
      throw new ForbiddenException('Access denied');
    }

    if (requiredRoles && !hasIntersection(groups, requiredRoles)) {
      throw new ForbiddenException('Access denied');
    }

    if (allowedRoles && !hasIntersection(groups, allowedRoles)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
