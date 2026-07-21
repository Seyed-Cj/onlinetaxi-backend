import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthService } from './socket-auth.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway implements OnGatewayInit {
  constructor(private readonly socketAuthService: SocketAuthService) {}

  @WebSocketServer()
  server!: Server;

  private logger = new Logger('SocketGateway');

  async afterInit(server: Server) {
    server.use(async (socket, next) => {
      try {
        await this.socketAuthService.authorize(socket);
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });
  }

  async handleConnection(client: Socket) {
    const { acc_type, driver, passenger } = client.data;

    switch (acc_type) {
      case 'DRIVER':
        client.join(`driver-${driver.id}`);
        this.logger.log(`Driver ${driver.id} connected`);
        break;
      case 'PASSENGER':
        client.join(`passenger-${passenger.id}`);
        this.logger.log(`Passenger ${passenger.id} connected`);
        break;
    }
  }

  async handleDisconnect(client: Socket) {
    const { acc_type, driver, passenger } = client.data;

    switch (acc_type) {
      case 'DRIVER':
        client.leave(`driver-${driver.id}`);
        this.logger.log(`Driver ${driver.id} disconnected`);
        break;
      case 'PASSENGER':
        client.leave(`passenger-${passenger.id}`);
        this.logger.log(`Passenger ${passenger.id} disconnected`);
        break;
    }
  }

  @SubscribeMessage('driver:location')
  handleLocation(
    @MessageBody() data: { lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    const driver = client.data.driver;
    if (!driver) return;

    this.server.emit('driver:location:update', {
      driverId: driver.id,
      ...data,
    });

    this.logger.log(
      `Location update from driver ${driver.id}: ${data.lat}, ${data.lng}`,
    );
  }
}
