import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

export function getRefreshTokenCookieOptions(
  configService: ConfigService,
): CookieOptions {
  const isProduction =
    configService.get<string>('ENVIRONMENT') === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    path: '/auth/refresh',
  };
}
