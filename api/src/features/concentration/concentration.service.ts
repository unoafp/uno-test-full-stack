import { Injectable } from '@nestjs/common';
import { CreateConcentrationDto } from './dto/create-concentration.dto';
import { UpdateConcentrationDto } from './dto/update-concentration.dto';

@Injectable()
export class ConcentrationService {
  create(createConcentrationDto: CreateConcentrationDto) {
    return 'This action adds a new concentration';
  }

  findAll() {
    return `This action returns all concentration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} concentration`;
  }

  update(id: number, updateConcentrationDto: UpdateConcentrationDto) {
    return `This action updates a #${id} concentration`;
  }

  remove(id: number) {
    return `This action removes a #${id} concentration`;
  }
}
