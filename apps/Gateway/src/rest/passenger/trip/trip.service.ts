import { Injectable } from '@nestjs/common';
import { handleServCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class PassengerTripService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async createTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'create',
      query: data,
    });
    return handleServCliResponse(res);
  }
}
