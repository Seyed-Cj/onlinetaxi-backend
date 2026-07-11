import { Injectable } from '@nestjs/common';
import {
  DriverRequestOtpInputDto,
  DriverVerifyOtpInputDto,
} from 'src/dtos/driver.dto';
import { handleServCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly MainSrvCli: MainServiceClient) {}

  async requestOtp(body: DriverRequestOtpInputDto) {
    const data = await this.MainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'requestOtp',
      query: body,
    });

    return handleServCliResponse(data);
  }

  async verifyOtp(body: DriverVerifyOtpInputDto) {
    const data = await this.MainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'verifyOtp',
      query: body,
    });

    return handleServCliResponse(data);
  }

  async authorize(token: string) {
    const data = await this.MainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'authorize',
      query: { token },
    });
    return handleServCliResponse(data);
  }
}
