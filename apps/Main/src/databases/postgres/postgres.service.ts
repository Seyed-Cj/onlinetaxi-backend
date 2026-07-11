import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import * as models from './models/index';

@Injectable()
export class PostgresService implements OnModuleInit {
  public connection!: Sequelize;
  private logger = new Logger('_databases/postgres/postgres.service');
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    console.log('Trying to connect database');
    const dbConfig = this.configService.get('Database');

    const sequlizeInstance = new Sequelize({
      dialect: dbConfig.dialect,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      logging: false,
    });
    sequlizeInstance.addModels(Object.values(models));

    models.Admin.hasMany(models.AdminSession, {
      foreignKey: 'adminId',
      as: 'sessions',
    });
    models.AdminSession.belongsTo(models.Admin, {
      foreignKey: 'adminId',
      as: 'admin',
    });
    models.Admin.addScope('withoutPassword', {
      attributes: {
        exclude: ['password', 'salt'],
      },
    });
    models.Driver.hasOne(models.DriverSession, {
      foreignKey: 'driverId',
      as: 'session',
    });
    models.DriverSession.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver',
    });

    try {
      await sequlizeInstance.sync({ alter: true });
    } catch (e) {
      this.logger.fatal('Syncing error');
      this.logger.fatal(e);
      console.log(e);
      process.exit(1);
    }
    this.logger.verbose('Postgres database is connected!');
    this.connection = sequlizeInstance;
  }

  public models = models;
}
