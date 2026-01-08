import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: 'ACCESS_JWT',
      useFactory: (config: ConfigService) => {
        const jwtService = new JwtService({
          secret: config.getOrThrow('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: '15m' },
        });
        return jwtService;
      },
      inject: [ConfigService],
    },
    {
      provide: 'REFRESH_JWT',
      useFactory: (config: ConfigService) => {
        const jwtService = new JwtService({
          secret: config.getOrThrow('JWT_REFRESH_SECRET'),
          signOptions: { expiresIn: '7d' },
        });
        return jwtService;
      },
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
