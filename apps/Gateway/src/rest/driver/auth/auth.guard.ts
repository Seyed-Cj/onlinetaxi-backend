import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class DriverAuthGuard implements CanActivate {
  constructor(
    private readonly authService: DriverAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: any = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    if (isPublic) return true;

    const token = this.extractTokenFromHeader(request);
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

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
