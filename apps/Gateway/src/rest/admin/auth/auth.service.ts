import { Injectable } from '@nestjs/common';
import { AdminSignInInputDto } from 'src/dtos/admin.dto';
import { handleServCliResonse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class AdminAuthService {
  constructor(private readonly MainSrvCli: MainServiceClient) {}

  async signin(signInData: AdminSignInInputDto) {
    const data = await this.MainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'signin',
      query: signInData,
    });

    return handleServCliResonse(data);
  }
}
