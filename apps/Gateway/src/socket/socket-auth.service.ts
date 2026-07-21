import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class SocketAuthService {
  constructor(private readonly mainSrv: MainServiceClient) {}

  async authorize(client: Socket): Promise<void> {
    const token = client.handshake.auth.token;

    if (!token) {
      throw new Error('Missing token');
    }

    let payload: any;

    try {
      payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );
    } catch {
      throw new Error('Invalid token');
    }

    const accType = payload?.ut;

    const provider =
      accType === 'DRIVER'
        ? 'DRIVERS'
        : accType === 'PASSENGER'
          ? 'PASSENGERS'
          : null;

    if (!provider) {
      throw new Error('Invalid account type');
    }

    const res = await this.mainSrv.callAction({
      provider,
      action: 'authorize',
      query: { token },
    });

    if (!res?.data?.isAuthorized) {
      throw new Error('Unauthorized');
    }

    if (res.data.isActive === false) {
      throw new Error('Inactive account');
    }

    client.data.acc_type = accType;
    client.data.session = res.data.session;

    if (accType === 'DRIVER') {
      client.data.driver = res.data.driver;
    }

    if (accType === 'PASSENGER') {
      client.data.passenger = res.data.passenger;
    }
  }
}
