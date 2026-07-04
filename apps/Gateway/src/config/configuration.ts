import { registerAs } from '@nestjs/config';

const AppConfig = registerAs('App', () => ({
  port: 3000,
  version: 'v1',
}));

const SwaggerConfig = registerAs('Swagger', () => ({
  Title: 'OnlineTaxi-Backend',
  Version: '1.0.0',
  Description: 'online taxi api like snapp aplication',
}));

export const configurations = [AppConfig, SwaggerConfig];
