import { Module } from '@nestjs/common';
import { DriverAuthController } from './auth/auth.controller';
import { DriverAuthService } from './auth/auth.service';
import { DriverTripController } from './trip/trip.controller';
import { DriverTripService } from './trip/trip.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [DriverAuthController, DriverTripController],
  providers: [DriverAuthService, DriverTripService],
  imports: [SocketModule],
})
export class DriverModule {}
