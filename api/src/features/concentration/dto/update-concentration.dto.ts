import { PartialType } from '@nestjs/mapped-types';
import { CreateConcentrationDto } from './create-concentration.dto';

export class UpdateConcentrationDto extends PartialType(CreateConcentrationDto) {}
