import { Module } from '@nestjs/common';
import { AdminAuthController } from './auth/auth.controller';
import { AdminAuthService } from './auth/auth.service';

@Module({
  controllers: [AdminAuthController],
  providers: [AdminAuthService]
})
export class AdminModule {}
