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

    //websocket notification to passenger that driver has accepted the trip
    this.socketGateway.server
      .to(`passenger-${trip.passengerId}`)
      .emit('trip:accepted', trip);

    return handleServCliResponse(res);
  }

  async arrivedTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'arrived',
      query: data,
    });

    const trip = res.data;

    //websocket notification to passenger that driver has arrived at origin
    this.socketGateway.server
      .to(`passenger-${trip.passengerId}`)
      .emit('trip:driver_arrived', {
        tripId: trip.id,
        driverId: trip.driverId,
        arrivedAt: trip.arrivedAt,
      });

    return handleServCliResponse(res);
  }
}
