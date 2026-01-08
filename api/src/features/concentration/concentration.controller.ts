import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConcentrationService } from './concentration.service';
import { CreateConcentrationDto } from './dto/create-concentration.dto';
import { UpdateConcentrationDto } from './dto/update-concentration.dto';

@Controller('concentration')
export class ConcentrationController {
  constructor(private readonly concentrationService: ConcentrationService) {}

  @Post()
  create(@Body() createConcentrationDto: CreateConcentrationDto) {
    return this.concentrationService.create(createConcentrationDto);
  }

  @Get()
  findAll() {
    return this.concentrationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concentrationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConcentrationDto: UpdateConcentrationDto) {
    return this.concentrationService.update(+id, updateConcentrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concentrationService.remove(+id);
  }
}
