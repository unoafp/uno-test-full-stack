import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GameplaysModule } from './modules/gameplays/gameplays.module';

@Module({
  imports: [AuthModule, GameplaysModule],
})
export class AppModule {}
