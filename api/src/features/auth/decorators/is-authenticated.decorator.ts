// is-authenticated.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { GroupsGuard } from '../guards/groups.guard';
import { JwtAuthGuard } from '../guards/jwt-auth-guard.guard';

export const USER_ROLES_KEY = 'USER_ROLES_KEY';
export type AuthArray = string[];
export type AuthObject = {
  allowedRoles?: AuthArray;
  requiredRoles?: AuthArray;
  prohibitedRoles?: AuthArray;
};

export type AuthOptions = AuthArray | AuthObject;

export const AUTH_DECORATOR_KEY = 'AUTH_DECORATOR_KEY';

export function IsAuthenticated(options?: AuthOptions) {
  return applyDecorators(
    SetMetadata(AUTH_DECORATOR_KEY, options),
    UseGuards(JwtAuthGuard, GroupsGuard),
  );
}
