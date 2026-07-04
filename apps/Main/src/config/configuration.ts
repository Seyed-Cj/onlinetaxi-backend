import { registerAs } from '@nestjs/config';

const DatabaseConfig = registerAs('Database', () => ({
  database: 'taxidb',
  username: 'onlinetaxi',
  password: 'TAXI1234',
  port: 5433,
  dialect: 'postgres',
}));

export const configurations = [DatabaseConfig];
