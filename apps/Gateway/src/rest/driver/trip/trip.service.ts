import { Injectable } from '@nestjs/common';
import { handleServCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverTripService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async acceptTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'accept',
      query: data,
    });
    return handleServCliResponse(res);
  }
}
