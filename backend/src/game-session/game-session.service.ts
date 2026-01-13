import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSession } from './entities/game-session.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { GameResult } from './enums/game-results.enum';

@Injectable()
export class GameSessionService {

  private readonly logger = new Logger('GameSessionService');

  constructor(
    @InjectRepository(GameSession)
    private readonly gameSessionRepository: Repository<GameSession>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createGameSessionDto: CreateGameSessionDto) {
    try {

      const user = await this.userRepository.findOne({
        where: { id: createGameSessionDto.idUser },
      });

      if (!user) throw new NotFoundException('User not found');

  
      const { idUser, ...rest } = createGameSessionDto;

      const gameSession = this.gameSessionRepository.create({
        ...rest,  
        user,    
      });

      await this.gameSessionRepository.save(gameSession);
      return "the registered game has been saved successfully";

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }


  async findByRut(rut: string): Promise<GameSession[]> {
    return this.gameSessionRepository.find({
      where: {
        user: {rut},
      },
      relations: ['user'],
    });
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
