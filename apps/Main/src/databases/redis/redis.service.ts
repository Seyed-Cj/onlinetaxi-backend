import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private logger = new Logger('databases/redis/redis.service');

  public cacheCli!: Redis;
  public sessionCli!: Redis;

  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    const cacheClient = new Redis({
      host: this.configService.get('Redis.host'),
      port: this.configService.get('Redis.port'),
      db: this.configService.get('Redis.cacheDb'),
    });
    cacheClient.on('error', (e) => {
      this.logger.fatal('cacheClient connecting error');
      this.logger.fatal(e);
      process.exit(1);
    });
    cacheClient.on('connect', () => {
      this.logger.verbose('cacheClient is connected!');
    });
    this.cacheCli = cacheClient;

    const sessionClient = new Redis({
      host: this.configService.get('Redis.host'),
      port: this.configService.get('Redis.port'),
      db: this.configService.get('Redis.sessionDb'),
    });
    sessionClient.on('error', (e) => {
      this.logger.fatal('sessionClient connecting error');
      this.logger.fatal(e);
      process.exit(1);
    });
    sessionClient.on('connect', () => {
      this.logger.verbose('sessionClient is connected!');
    });
    this.sessionCli = sessionClient;
  }
}
