import { Module } from '@nestjs/common';
import { PassengerAuthController } from './auth/auth.controller';
import { PassengerAuthService } from './auth/auth.service';

@Module({
  controllers: [PassengerAuthController],
  providers: [PassengerAuthService],
})
export class PassengerModule {}
