import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { GameResult } from '../enums/game-results.enum';

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Se realiza la creación de la llave foránea de User
  @ManyToOne(() => User, (user) => user.gameSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'timestamp',
    name: 'finished_at',
  })
  finishedAt: Date;

  @Column({
    type: 'enum',
    enum: GameResult,
    name: 'result_game',
  })
  resultGame: GameResult;

  @Column({ type: 'int' })
  errors: number;

  @Column({ type: 'int' })
  hits: number;

  @Column({
    type: 'uuid',
    name: 'deck_code',
  })
  codeDeck: string;
}
