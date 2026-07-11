import { registerAs } from '@nestjs/config';

const ServerConfig = registerAs('Server', () => ({
  name: 'online-taxi',
}))

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

const JwtConfig = registerAs('JWT', () => ({
  access: { secret: 'ACCESS_SECRET', expiresInSeconds: 60 * 15 },
  refresh: { secret: 'REFRESH_SECRET', expiresInSeconds: 60 * 60 * 24 * 7 },
}));

export const configurations = [DatabaseConfig, RedisConfig, JwtConfig, ServerConfig];
