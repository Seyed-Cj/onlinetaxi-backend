import { Module } from '@nestjs/common';
import { ServiceModule } from './services/service.module';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configuration';
import { DatabaseModule } from './databases/database.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    UtilsModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
