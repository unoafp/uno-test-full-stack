import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
  );
  app.use(cookieParser());

  if (process.env.ENVIRONMENT === 'dev') {
    console.log('enabled dev CORS');
    app.enableCors({
      origin: ['http://localhost:5173'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: ['https://mi-frontend.com'],
      credentials: true,
    });
  }
  await app.listen(3000);
}
bootstrap();
