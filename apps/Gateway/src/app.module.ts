import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configuration';
import { RestModule } from './rest/rest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RestModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
