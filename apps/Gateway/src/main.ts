import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const configSevice = app.get(ConfigService);
  const port = configSevice.get('PORT');
  await app.listen(port);
  console.log(`server running on port ${port}`);
}
bootstrap();
