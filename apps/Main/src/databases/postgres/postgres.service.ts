import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize';

@Injectable()
export class PostgresService implements OnModuleInit {
  public connection!: Sequelize;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      console.log('Trying to connect database')
      const dbConfig = this.configService.get('Database');

      this.connection = new Sequelize({
        dialect: dbConfig.dialect,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        logging: false,
      });

      await this.connection.authenticate();
      console.log('database connected')
    } catch (e) {
      console.log('[dblog', e);
      process.exit(1);
    }
  }
}
