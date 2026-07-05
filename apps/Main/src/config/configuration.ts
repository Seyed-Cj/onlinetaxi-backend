import { registerAs } from '@nestjs/config';

const DatabaseConfig = registerAs('Database', () => ({
  database: 'taxidb',
  username: 'onlinetaxi',
  password: 'TAXI1234',
  port: 5433,
  dialect: 'postgres',
}));

const RedisConfig = registerAs('Redis', () => ({
  host: '127.0.0.1',
  port: 6379,
  cacheDb: 10,
  sessionDb: 11,
}));

export const configurations = [DatabaseConfig, RedisConfig];
