import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { Response } from 'express';

@Injectable()
export class DriverAuthGuard implements CanActivate {
  constructor(private readonly authService: DriverAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const token = request.cookies['auth_driver'];
    if (!token) throw new UnauthorizedException('err_auth_unauthorized');

    const authorized = await this.authService.authorize(token);

    const data = authorized;
    if (!data.isAuthorized)
      throw new UnauthorizedException('err_auth_unauthorized');

    request.driver = data.driver;
    request.session = data.session;
    request.acc_data = 'DRIVER';

    if (data.tokenData) {
      response.cookie('auth_driver', data.tokenData.token, {
        httpOnly: true,
        maxAge: data.tokenData.ttl,
      });
    }

    if (data.clearCookie) response.clearCookie(data.clearCookie);

    return true;
  }
}
