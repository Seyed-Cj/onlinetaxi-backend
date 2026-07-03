import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
