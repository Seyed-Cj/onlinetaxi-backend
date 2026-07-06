import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvErr,
} from 'src/services/dto';

@Injectable()
export class DriverService {
  private static readonly role = 'driver';
  constructor(
    private readonly pg: PostgresService,
    private readonly redis: RedisService,
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

    const newSession = this.pg.models.DriverSession.create({
      driverId: driver.id,
      refreshExpiresAt: +new Date(),
    });

    return {
      message: 'OTP verifyed successfuly!',
      data: {
        success: true,
        phone,
      },
    };
  }
}
