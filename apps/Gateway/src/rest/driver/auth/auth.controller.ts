import { Controller, Post } from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { DriverSignUpInputDto } from 'src/dtos/driver.dto';

@Controller('auth')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Signup in app by phone number' })
  async signUp(body: DriverSignUpInputDto) {
    const signUpData = await this.driverAuthService.signup(body);
    return signUpData;
  }
}
