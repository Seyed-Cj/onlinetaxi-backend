import { HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvErr,
} from 'src/services/dto';
import { JwtHandler } from 'src/utils/handlers/jwt.handler';

@Injectable()
export class PassengerService {
  private static readonly role = 'passenger';
  constructor(
    private readonly pg: PostgresService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtHandler,
  ) {}

  async requestOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone } = query;

    if (!phone || typeof phone !== 'string') {
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Invalid phone');
    }

    const key = `otp:${PassengerService.role}:${phone}`;
    const existing = await this.redis.cacheCli.get(key);
    if (existing) throw new SrvErr(HttpStatus.BAD_REQUEST, 'otp already sent');
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const ttl = 2 * 60;
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
    const key = `otp:${PassengerService.role}:${phone}`;

    const savedOtp = await this.redis.cacheCli.get(key);
    if (!savedOtp)
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Otp not found or expired');

    if (savedOtp !== otp)
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Invalid OTP');

    await this.redis.cacheCli.del(key);

    let passenger = await this.pg.models.Passenger.findOne({ where: { phone } });
    if (!passenger) passenger = await this.pg.models.Passenger.create({ phone });

    await this.pg.models.PassengerSession.destroy({
      where: { passengerId: passenger.id },
    });

    const newSession = await this.pg.models.PassengerSession.create({
      passengerId: passenger.id,
      refreshExpiresAt: +new Date(),
    });

    const tokenData = this.jwtService.generateAccessToken(
      passenger.id,
      'PASSENGER',
      newSession.id,
    );

    await newSession.update({
      refreshExpiresAt: tokenData.payload.refreshExpiresAt,
    });
    await newSession.reload();

    await this.redis.cacheCli.set(
      `passenger_${passenger.id}`,
      JSON.stringify(JSON.parse(JSON.stringify(passenger))),
      'EX',
      900,
    );
    await this.redis.cacheCli.set(
      `passengerSession_${newSession.id}`,
      JSON.stringify(newSession),
      'EX',
      900,
    );

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
    let tokenData;
    let passenger;
    let session;

    const decodedToken = this.jwtService.decodeAccessToken(token);

    if (decodedToken) {
      const passengerId = decodedToken.accountId;
      passenger = await this.getPassengerById(passengerId);
      if (passenger) {
        session = await this.getSessionById(decodedToken.sessionId);
        const now = Date.now();

        if (decodedToken.refreshExpiresAt <= now) {
          await this.pg.models.PassengerSession.destroy({
            where: { id: decodedToken.sessionId },
          });
          await this.redis.cacheCli.del(
            `passengerSession_${decodedToken.sessionId}`,
          );
        } else if (decodedToken.accessExpiresAt <= now) {
          if (session) {
            tokenData = this.jwtService.generateAccessToken(
              passengerId,
              'PASSENGER',
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

    return {
      data: {
        isAuthorized,
        passenger,
        session,
        tokenData,
        isActive: passenger?.isActive ?? null,
      },
    };
  }

  private async getPassengerById(id: string) {
    let passenger = null;
    let _passenger: any = await this.redis.cacheCli.get(`passenger_${id}`);

    if (!_passenger) {
      _passenger = await this.pg.models.Passenger.findByPk(id);
      if (!_passenger) return null;

      _passenger = JSON.parse(JSON.stringify(_passenger));
      await this.redis.cacheCli.set(
        `passenger_${_passenger.id}`,
        JSON.stringify(_passenger),
        'EX',
        900,
      );
      passenger = _passenger;
    } else {
      passenger = JSON.parse(_passenger);
    }
    return passenger;
  }

  private async getSessionById(id: string) {
    let session = null;
    let _session: any = await this.redis.cacheCli.get(`passengerSession_${id}`);
    if (!_session) {
      _session = await this.pg.models.PassengerSession.findByPk(id);
      if (!_session) return null;

      await this.redis.cacheCli.set(
        `passengerSession_${_session.id}`,
        JSON.stringify(_session),
        'EX',
        900,
      );
      session = _session;
    } else session = JSON.parse(_session);
    return session;
  }

  private async extendSession(id: string, refreshExpiresAt: number) {
    const updated = await this.pg.models.PassengerSession.update(
      { refreshExpiresAt },
      { where: { id }, returning: true },
    );
    const session = updated[0] ? updated[1][0] : null;
    if (session)
      await this.redis.cacheCli.set(
        `passengerSession_${session.id}`,
        JSON.stringify(session),
        'EX',
        900,
      );
    return session;
  }
}
