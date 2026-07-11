import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvErr,
} from 'src/services/dto';
import { JwtHandler } from 'src/utils/handlers/jwt.handler';

@Injectable()
export class DriverService {
  private static readonly role = 'driver';
  constructor(
    private readonly pg: PostgresService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtHandler,
  ) {}

  async requestOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone } = query;
    const key = `otp:${DriverService.role}:${phone}`;
    const existing = await this.redis.cacheCli.get(key);
    if (existing) throw new SrvErr(HttpStatus.BAD_REQUEST, 'otp already sent');
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const ttl = 20 * 60;
    await this.redis.cacheCli.set(key, otp, 'EX', ttl);

    return {
      message: 'OTP send successfuly.',
      data: { success: true, phone, otp, expiresIn: ttl },
    };
  }

  async verifyOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone, otp } = query;
    const key = `otp:${DriverService.role}:${phone}`;

    const savedOtp = await this.redis.cacheCli.get(key);
    if (!savedOtp)
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Otp not found or expired');

    if (savedOtp !== otp)
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Invalid OTP');

    await this.redis.cacheCli.del(key);

    let driver = await this.pg.models.Driver.findOne({ where: { phone } });
    if (!driver) driver = await this.pg.models.Driver.create({ phone });

    const newSession = await this.pg.models.DriverSession.create({
      driverId: driver.id,
      refreshExpiresAt: +new Date(),
    });

    const tokenData = this.jwtService.generateAccessToken(
      driver.id,
      'DRIVER',
      newSession.id,
    );

    await newSession.update({
      refreshExpiresAt: tokenData.payload.refreshExpiresAt,
    });
    await newSession.reload();

    return {
      message: 'OTP verifyed successfuly!',
      data: {
        success: true,
        phone,
        tokenData,
      },
    };
  }

  async authorize({
    query: { token },
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    let isAuthorized = false;
    let clearCookie: string | null = 'auth_driver';

    let tokenData;
    let driver;
    let session;

    const decodedToken = this.jwtService.decodeAccessToken(token);

    if (decodedToken) {
      const driverId = decodedToken.accountId;
      driver = await this.getDriverById(driverId);
      if (driver) {
        session = await this.getSessionById(decodedToken.sessionId);
        const now = Date.now();

        if (+new Date(decodedToken.refreshExpiresAt) <= now) {
          await this.pg.models.DriverSession.destroy({
            where: { id: decodedToken.sessionId },
          });
          await this.redis.cacheCli.del(`driverSession_${decodedToken.sessionId}`);
        } else if (+new Date(decodedToken.accessExpiresAt) <= now) {
          if (session) {
            tokenData = this.jwtService.generateAccessToken(
              driverId,
              'DRIVER',
              session.id,
            );

            session = await this.extendSession(
              session.id,
              tokenData.payload.refreshExpiresAt,
            );

            isAuthorized = true;
          }
        } else {
          if (session) isAuthorized = true;
        }
      }
    }
    if (isAuthorized) clearCookie = null;
    return {
      data: {
        isAuthorized,
        driver,
        session,
        clearCookie,
        tokenData,
        isActive: driver?.isActive ?? null,
      },
    };
  }

  private async getDriverById(id: string) {
    let driver = null;
    let _driver: any = await this.redis.cacheCli.get(`driver_${id}`);

    if (!_driver) {
      _driver = await this.pg.models.Driver.findByPk(id);
      if (!_driver) return null;

      _driver = JSON.parse(JSON.stringify(_driver));
      await this.redis.cacheCli.set(
        `driver_${_driver.id}`,
        JSON.stringify(_driver),
        'EX',
        900,
      );
      driver = _driver;
    } else {
      driver = JSON.parse(_driver);
    }
    return driver;
  }

  private async getSessionById(id: string) {
    let session = null;
    let _session: any = await this.redis.cacheCli.get(`driverSession_${id}`);
    if (!_session) {
      _session = await this.pg.models.DriverSession.findByPk(id);
      if (!_session) return null;

      await this.redis.cacheCli.set(
        `driverSession_${_session.id}`,
        JSON.stringify(_session),
        'EX',
        900,
      );
      session = _session;
    } else session = JSON.parse(_session);
    return session;
  }

  private async extendSession(id: string, refreshExpiresAt: number) {
    const updated = await this.pg.models.Driver.update(
      { refreshExpiresAt },
      { where: { id }, returning: true },
    );
    const session = updated[0] ? updated[1][0] : null;
    if (session)
      await this.redis.cacheCli.set(
        `driverSession_${session.id}`,
        JSON.stringify(session),
        'EX',
        900,
      );
    return session;
  }
}
