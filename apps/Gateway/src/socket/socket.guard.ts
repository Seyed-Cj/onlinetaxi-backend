import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private readonly mainSrv: MainServiceClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth.token;

    if (!token) {
      client.disconnect(true);
      return false;
    }

    let payload: any;
    try {
      payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    } catch (error) {
      client.disconnect(true);
      return false;
    }

    const accType = payload?.ut;
    if (!accType) {
      client.disconnect(true);
      return false;
    }

    const provider =
      accType === 'DRIVER'
        ? 'DRIVERS'
        : accType === 'PASSENGER'
          ? 'PASSENGERS'
          : null;

    if (!provider) {
      client.disconnect(true);
      return false;
    }

    const res = await this.mainSrv.callAction({
      provider,
      action: 'authorize',
      query: { token },
    });

    if (!res?.data?.isAuthorized) {
      client.disconnect(true);
      return false;
    }

    if (res.data.isActive === false) {
      client.disconnect(true);
      return false;
    }

    client.data.acc_type = accType;
    client.data.session = res.data.session;

    if (accType === 'DRIVER') {
      client.data.driver = res.data.driver;
    }

    if (accType === 'PASSENGER') {
      client.data.passenger = res.data.passenger;
    }
    return true;
  }
}
