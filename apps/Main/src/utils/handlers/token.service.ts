import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenPayload {
  driverId: string;
  sessionId: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
}

export interface AccessTokenResult {
  name: string;
  ttl: string;
  token: string;
  payload: AccessTokenPayload;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  generateAccessToken(params: { driverId: string; sessionId: string }) {
    const now = Date.now();

    const accessExpiresInSec = this.config.get<number>('JWT.access.expiresInSeconds') ?? 3600;
    const refreshExpiresInSec = this.config.get<number>('JWT.refresh.expiresInSeconds') ?? 3600;

    const accessExpiresAt = now + accessExpiresInSec * 1000;
    const refreshExpiresAt = now + refreshExpiresInSec * 1000;

    const ttl = refreshExpiresAt * 1000;

    const payload = {
      did: params.driverId,
      sid: params.sessionId,
      aea: accessExpiresAt,
      rea: refreshExpiresAt,
    };

    const token = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT.access.secret'),
      expiresIn: accessExpiresInSec,
    });

    return {
      name: `auth_driver`,
      ttl,
      token,
      payload: {
        driverId: params.driverId,
        sessionId: params.sessionId,
        accessExpiresAt,
        refreshExpiresAt,
      },
    };
  }
}
