import { Module } from '@nestjs/common';
import { DriverAuthController } from './auth/auth.controller';
import { DriverAuthService } from './auth/auth.service';

@Module({
  controllers: [DriverAuthController],
  providers: [DriverAuthService]
})
export class DriverModule {}
