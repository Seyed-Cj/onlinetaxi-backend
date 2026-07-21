import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configuration';
import { RestModule } from './rest/rest.module';
import { ServiceModule } from './services/service.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RestModule,
    ServiceModule,
    SocketModule,
  ],
})
export class AppModule {}
