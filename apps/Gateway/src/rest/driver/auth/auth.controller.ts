import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DriverRequestOtpInputDto,
  DriverVerifyOtpInputDto,
} from 'src/dtos/driver.dto';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import type { Response } from 'express';
import { DriverAuthGuard } from './auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Driver:Auth')
@Controller('auth')
@ApiBearerAuth('Authorization')
@UseGuards(DriverAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('request-otp')
  @Public()
  @ApiOperation({ summary: 'request otp in app by phone number' })
  async requestOtp(@Body() body: DriverRequestOtpInputDto) {
    const requestOtpData = await this.driverAuthService.requestOtp(body);
    return requestOtpData;
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'verify otp sent to driver phone number' })
  async requestVerify(
    @Body() body: DriverVerifyOtpInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const verifyOtpData = await this.driverAuthService.verifyOtp(body);
    return verifyOtpData;
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get driver profile' })
  async getProfile(@Request() req) {
    return req.driver;
  }
}
