import { Body, Controller, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverRequestOtpInputDto, DriverVerifyOtpInputDto } from 'src/dtos/driver.dto';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponeInterceptor } from 'src/response/response.interceptor';

@ApiTags('Driver:Auth')
@Controller('auth')
// @UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponeInterceptor)
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'request otp in app by phone number' })
  async requestOtp(@Body() body: DriverRequestOtpInputDto) {
    const requestOtpData = await this.driverAuthService.requestOtp(body);
    return requestOtpData;
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'verify otp sent to driver phone number' })
  async requestVerify(@Body() body: DriverVerifyOtpInputDto) {
    const verifyOtpData = await this.driverAuthService.verifyOtp(body);
    return verifyOtpData;
  }
}
