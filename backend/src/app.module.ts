import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedCardsModule } from './seed-cards/seed-cards.module';
import { GameSessionModule } from './game-session/game-session.module';
import { DeckCardsModule } from './deck-cards/deck-cards.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_ENGINE: Joi.string()
          .valid('postgres', 'mysql', 'mariadb', 'oracle')
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_ENGINE as
        | 'postgres'
        | 'mysql'
        | 'mariadb'
        | 'oracle',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // cambiar a true solo para desarrollo
    }),
    SeedCardsModule,
    GameSessionModule,
    DeckCardsModule,
    UsersModule,
    CommonModule,
  ],
})
export class AppModule {}
