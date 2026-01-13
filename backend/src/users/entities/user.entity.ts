import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameSession } from 'src/game-session/entities/game-session.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Se realiza la aplicación de la clave usuario en la entidad GameSession.
  @OneToMany(() => GameSession, (gameSession) => gameSession.user)
  gameSession: GameSession[];

  @Column('varchar', {
    length: 10,
    unique: true,
  })
  rut: string;

  @Column('varchar', { length: 200 })
  name: string;
}
