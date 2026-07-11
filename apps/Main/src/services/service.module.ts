import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriverService } from 'src/providers/driver.service';
import { AdminService } from 'src/providers/admin.service';

@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [AdminService, DriverService, SelfActionService],
})
export class ServiceModule {}
