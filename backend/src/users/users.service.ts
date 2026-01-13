import { BadRequestException, Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return "The user has been registered successfully"

    } catch (error) {
      this.handleDbExceptions(error)
    }
  }
  
  async LoginUser(rut: string) {
    const user = await this.userRepository.findOne({
      where: {rut},
    });

    if(!user){
      
      throw new NotFoundException(`User with rut: ${rut} not exist`);
    } else {
      return user;
    }
  }

  private handleDbExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}