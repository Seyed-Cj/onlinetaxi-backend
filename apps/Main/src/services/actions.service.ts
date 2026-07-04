import { Injectable } from '@nestjs/common';
import { DriverService } from 'src/providers/driver.service';

@Injectable()
export class SelfActionService {
  constructor(private readonly driverService: DriverService) {}

  async findAndCall(data) {
    const providerName = data?.provider || null;
    const actionName = data?.action || null;
    if (!providerName || !actionName)
      throw new Error('err_service_noActionOrProvider');

    let provider: any;
    switch (providerName) {
      case 'DRIVERS':
        provider = this.driverService;
        break;
      default:
        provider = null;
    }
    if (!provider || !provider[actionName])
      throw new Error('err_service_noActionOrProvider');

    const response = await provider[actionName]();

    return {
      message: response?.message ?? 'Ok',
      data: response?.data ?? response,
    };
  }
}
