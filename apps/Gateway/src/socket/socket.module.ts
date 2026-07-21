import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketAuthService } from './socket-auth.service';


@Module({
  providers: [SocketGateway, SocketAuthService],
  exports: [SocketGateway],
})
export class SocketModule {}
