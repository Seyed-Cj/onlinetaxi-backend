import { registerAs } from '@nestjs/config';

const ServerConfig = registerAs('Server', () => ({
  name: 'online-taxi',
}))

const DatabaseConfig = registerAs('Database', () => ({
  database: process.env.DB_NAME || 'test',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  dialect: 'postgres',
}));

const RedisConfig = registerAs('Redis', () => ({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  cacheDb: Number(process.env.CACHE_DB) || 10,
  sessionDb: Number(process.env.SESSION_DB) || 11,
}));

const JwtConfig = registerAs('JWT', () => ({
  access: { secret: process.env.ACCESS_SECRET || 'ACCESS_SECRET', expiresInSeconds: Number(process.env.ACCESS_EXPIRES_IN) || 60 * 15 },
  refresh: { secret: process.env.REFRESH_SECRET || 'REFRESH_SECRET', expiresInSeconds: Number(process.env.REFRESH_EXPIRES_IN) || 60 * 60 * 24 * 7 },
}));

export const configurations = [DatabaseConfig, RedisConfig, JwtConfig, ServerConfig];
