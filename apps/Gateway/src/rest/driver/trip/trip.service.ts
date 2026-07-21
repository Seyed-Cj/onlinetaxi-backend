import { Injectable } from '@nestjs/common';
import { handleServCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class DriverTripService {
  constructor(
    private readonly mainSrvCli: MainServiceClient,
    private readonly socketGateway: SocketGateway,
  ) {}

  async acceptTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'accept',
      query: data,
    });

    const trip = res.data;

    this.socketGateway.server
      .to(`passenger-${trip.passengerId}`)
      .emit('trip:accepted', trip);

    return handleServCliResponse(res);
  }
}
