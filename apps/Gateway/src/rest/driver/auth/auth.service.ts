import { Injectable } from '@nestjs/common';
import { DriverSignUpInputDto } from 'src/dtos/driver.dto';

@Injectable()
export class DriverAuthService {
  async signup(body: DriverSignUpInputDto) {
    return 'test';
  }
}
