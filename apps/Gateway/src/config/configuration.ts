import { registerAs } from '@nestjs/config';

const AppConfig = registerAs('App', () => ({
  port: Number(process.env.PORT) || 3000,
  version: process.env.APP_VERSION || 'v1',
}));

const SwaggerConfig = registerAs('Swagger', () => ({
  Title: 'OnlineTaxi-Backend',
  Version: process.env.APP_VERSION || 'v1',
  Description: 'online taxi api like snapp aplication',
}));

export const configurations = [AppConfig, SwaggerConfig];
