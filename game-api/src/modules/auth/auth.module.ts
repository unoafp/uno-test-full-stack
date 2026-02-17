import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './auth.tokens';
import { InMemoryUserRepository } from './infrastructure/persistence/inmem/user-repository';
import { UserIdentifier } from './application/identifier';
import { UserRepository } from './domain/repository';
import { AuthController } from './auth.controller';

@Module({
  providers: [
    InMemoryUserRepository,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: UserIdentifier,
      useFactory: (repo: UserRepository) => new UserIdentifier(repo),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [UserIdentifier],
  controllers: [AuthController],
})
export class AuthModule {}
