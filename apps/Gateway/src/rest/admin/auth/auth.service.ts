import { Injectable } from '@nestjs/common';
import { AdminSignInInputDto, AdminSignInOutputDto, GetAdminProfileOutputDto } from 'src/dtos/admin.dto';
import { AuthorizeOutputDto } from 'src/dtos/public.dto';
import { handleServCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class AdminAuthService {
  constructor(private readonly MainSrvCli: MainServiceClient) {}

  async authorize(token: string): Promise<AuthorizeOutputDto> {
    const data = await this.MainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'authorize',
      query: { token },
    });
    return handleServCliResponse(data);
  }

  async signin(signInData: AdminSignInInputDto): Promise<AdminSignInOutputDto> {
    const data = await this.MainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'signin',
      query: signInData,
    });

    return handleServCliResponse(data);
  }

  async getProfile(req): Promise<GetAdminProfileOutputDto> {
    return {
      userType: req.acc_type,
      profile: req.acc_profile,
      session: req.acc_session,
    };
  }
}
