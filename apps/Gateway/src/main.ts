import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';


async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  //config
  const configService = app.get(ConfigService);
  const port = configService.get('App.port');

  //swagger
  setupSwagger(app, configService);

  await app.listen(port);
  console.log(`server running on port ${port}`);
}
bootstrap();
