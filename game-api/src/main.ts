import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3001;
  console.log(`Starting server on port ${port}...`);
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
