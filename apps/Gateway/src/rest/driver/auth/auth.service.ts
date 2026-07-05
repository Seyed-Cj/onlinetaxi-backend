import { Injectable } from '@nestjs/common';
import { DriverRequestOtpInputDto } from 'src/dtos/driver.dto';
import { handleServCliResonse } from 'src/response/httpException.filter';
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

    return handleServCliResonse(data);
  }
}
