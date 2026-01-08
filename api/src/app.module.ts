import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './database/drizzle.module';
import { ConcentrationModule } from './features/concentration/concentration.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [AppConfigModule, AuthModule, DrizzleModule, ConcentrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
