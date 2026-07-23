import { Injectable } from '@nestjs/common';
import { handleServCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class PassengerTripService {
  constructor(
    private readonly mainSrvCli: MainServiceClient,
    private readonly socketSrv: SocketGateway,
  ) {}

  async createTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'create',
      query: data,
    });
    this.socketSrv.server.to('drivers').emit('trip:new', res.data);
    return handleServCliResponse(res);
  }
}
