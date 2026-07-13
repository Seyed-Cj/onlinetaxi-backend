import { Injectable } from '@nestjs/common';
import { PassengerRequestOtpInputDto, PassengerVerifyOtpInputDto } from 'src/dtos/passenger.dto';
import { handleServCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class PassengerAuthService {
  constructor(private readonly MainSrvCli: MainServiceClient) {}

  async requestOtp(body: PassengerRequestOtpInputDto) {
    const data = await this.MainSrvCli.callAction({
      provider: 'PASSENGERS',
      action: 'requestOtp',
      query: body,
    });

    return handleServCliResponse(data);
  }

  async verifyOtp(body: PassengerVerifyOtpInputDto) {
    const data = await this.MainSrvCli.callAction({
      provider: 'PASSENGERS',
      action: 'verifyOtp',
      query: body,
    });

    return handleServCliResponse(data);
  }

  async authorize(token: string) {
    const data = await this.MainSrvCli.callAction({
      provider: 'PASSENGERS',
      action: 'authorize',
      query: { token },
    });
    return handleServCliResponse(data);
  }
}
