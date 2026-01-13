import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/desafio-uno/');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.listen(process.env.PORT ?? 3001);
    console.log(`Server running on port ${process.env.PORT ?? 3001}`);
  } catch (err) {
    console.error('Failed to bootstrap server', err);
    process.exit(1); // salir si el servidor no pudo iniciarse
  }
}

void bootstrap();
