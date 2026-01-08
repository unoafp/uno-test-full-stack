import { Module } from '@nestjs/common';
import { ConcentrationService } from './concentration.service';
import { ConcentrationController } from './concentration.controller';

@Module({
  controllers: [ConcentrationController],
  providers: [ConcentrationService],
})
export class ConcentrationModule {}
