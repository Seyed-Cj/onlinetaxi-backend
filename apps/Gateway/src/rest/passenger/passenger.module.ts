import { Module } from '@nestjs/common';
import { PassengerAuthController } from './auth/auth.controller';
import { PassengerAuthService } from './auth/auth.service';
import { PassengerTripController } from './trip/trip.controller';
import { PassengerTripService } from './trip/trip.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [PassengerAuthController, PassengerTripController],
  providers: [PassengerAuthService, PassengerTripService],
  imports: [SocketModule],
})
export class PassengerModule {}
