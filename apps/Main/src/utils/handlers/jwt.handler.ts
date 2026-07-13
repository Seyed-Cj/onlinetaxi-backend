import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export enum JwtTypeEnum {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum TokenAvailabilityTypeEnum {
  AVAILABLE = 'AVAILABLE',
  EXPIRED = 'EXPIRED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export type UserType = 'ADMIN' | 'DRIVER' | 'PASSENGER';

export interface AccessPayloadType {
  userType: UserType;
  accountId: string;
  sessionId: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

interface AccessWrappedPayloadType {
  ut: UserType;
  aid: string;
  sid: string;
  aea: number;
  rea: number;
}

@Injectable()
export class JwtHandler {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private get projectName() {
    return this.config.get<string>('Server.name')!;
  }

  private getTokenName(tokenName: string, userType: UserType) {
    return `${this.projectName.toLowerCase()}_${tokenName.toLowerCase()}_${userType.toLowerCase()}`;
  }

  private getOptions(type: JwtTypeEnum) {
    return this.config.get<{
      secret: string;
      expiresInSeconds: number;
    }>(`JWT.${type}`)!;
  }

  generateToken(type: JwtTypeEnum, payload: object) {
    const options = this.getOptions(type);

    const token = this.jwtService.sign(payload, {
      secret: options.secret,
      expiresIn: options.expiresInSeconds,
    });

    return {
      token,
      ttl: options.expiresInSeconds * 1000,
    };
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  verifyToken<T extends object = any>(token: string, type: JwtTypeEnum): T | null {
    try {
      return this.jwtService.verify<T>(token, {
        secret: this.getOptions(type).secret,
      });
    } catch {
      return null;
    }
  }

  generateAccessToken(
    accountId: string,
    userType: UserType,
    sessionId: string,
  ) {
    const access = this.getOptions(JwtTypeEnum.ACCESS);
    const refresh = this.getOptions(JwtTypeEnum.REFRESH);

    const now = Date.now();

    const payload: AccessWrappedPayloadType = {
      ut: userType,
      aid: accountId,
      sid: sessionId,
      aea: now + access.expiresInSeconds * 1000,
      rea: now + refresh.expiresInSeconds * 1000,
    };

    return {
      name: this.getTokenName('auth', userType),
      ttl: refresh.expiresInSeconds * 1000,
      token: this.generateToken(JwtTypeEnum.ACCESS, payload).token,
      payload: this.payloadWrapper(payload),
    };
  }

  payloadWrapper(
    payload: AccessWrappedPayloadType,
  ): AccessPayloadType {
    return {
      userType: payload.ut,
      accountId: payload.aid,
      sessionId: payload.sid,
      accessExpiresAt: payload.aea,
      refreshExpiresAt: payload.rea,
    };
  }

  decodeAccessToken(token: string): AccessPayloadType {
    const payload = this.decodeToken(token) as AccessWrappedPayloadType;
    return this.payloadWrapper(payload);
  }

  verifyAccessToken(token: string): AccessPayloadType | null {
    const payload = this.verifyToken<AccessWrappedPayloadType>(
      token,
      JwtTypeEnum.ACCESS,
    );

    return payload ? this.payloadWrapper(payload) : null;
  }

  checkExpiry(token: string): TokenAvailabilityTypeEnum {
    try {
      const decoded = this.decodeAccessToken(token);

      const now = Date.now();

      if (decoded.accessExpiresAt > now) {
        return TokenAvailabilityTypeEnum.AVAILABLE;
      }

      if (
        decoded.accessExpiresAt <= now &&
        decoded.refreshExpiresAt > now
      ) {
        return TokenAvailabilityTypeEnum.EXPIRED;
      }

      return TokenAvailabilityTypeEnum.UNAVAILABLE;
    } catch {
      return TokenAvailabilityTypeEnum.UNAVAILABLE;
    }
  }

  revoke(userType: UserType) {
    return {
      name: this.getTokenName('auth', userType),
      ttl: 0,
    };
  }
}