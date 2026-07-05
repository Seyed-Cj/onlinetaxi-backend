import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/databases/redis/redis.service';

@Injectable()
export class DriverService {
  private static readonly role = 'driver';
  constructor(private readonly redis: RedisService) {}

  async requestOtp({ phone }: { phone: string }) {
    const key = `otp:${DriverService.role}:${phone}`;
    const existing = await this.redis.cacheCli.get(key);
    if (existing) throw new BadRequestException('otp already sent');
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const ttl = 20 * 60;
    await this.redis.cacheCli.set(key, otp, 'EX', ttl);

    return { success: true, phone, otp, expiresIn: ttl };
  }
}
