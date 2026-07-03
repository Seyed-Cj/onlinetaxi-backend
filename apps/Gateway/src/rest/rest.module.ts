import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { DriverModule } from './driver/driver.module';
import { PassengerModule } from './passenger/passenger.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'driver',
        module: DriverModule,
      },
      {
        path: 'passenger',
        module: PassengerModule,
      },
    ]),
  ],
})
export class RestModule {}
