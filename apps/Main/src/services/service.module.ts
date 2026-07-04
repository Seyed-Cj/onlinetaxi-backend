import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriverService } from 'src/providers/driver.service';

@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [DriverService, SelfActionService],
})
export class ServiceModule {}
