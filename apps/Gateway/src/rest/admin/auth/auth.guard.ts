import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { Response } from 'express';
import { RequestWithUserData } from 'src/dtos/public.dto';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';


@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AdminAuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: RequestWithUserData = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const tokenName = 'online-taxi_auth_admin';
    const token = request.cookies[tokenName];

    if (isPublic) {
      if (token) throw new UnauthorizedException('already_logged_in');
      return true;
    }

    if (!token) throw new UnauthorizedException('no_token_found');

    let authorized;
    try {
      authorized = await this.authService.authorize(token);
    } catch (err) {
      response.clearCookie('online-taxi_auth_admin', { path: '/' });
      throw new UnauthorizedException('invalid_token');
    }

    request.acc_profile = authorized.profile;
    request.acc_session = authorized.session;
    request.acc_type = 'ADMIN';
    request.acc_isActive = authorized.isActive;

    if (!authorized.isAuthorized) {
      response.clearCookie('auth_admin', { path: '/' });
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    if (authorized.tokenData) {
      const td = authorized.tokenData;
      response.cookie('auth_admin', td.token, {
        maxAge: td.ttl,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    return authorized.isAuthorized;
  }
}