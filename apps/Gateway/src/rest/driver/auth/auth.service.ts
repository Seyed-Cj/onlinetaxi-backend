import { Injectable } from '@nestjs/common';
import { DriverSignUpInputDto } from 'src/dtos/driver.dto';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly MainSrvCli: MainServiceClient) {}

  async signup(body: DriverSignUpInputDto) {
    const data = await this.MainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'signIn',
      query: body,
    });

    return data;
  }
}
