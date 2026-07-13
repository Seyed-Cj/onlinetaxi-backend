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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import type { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { PassengerAuthService } from './auth.service';
import { PassengerRequestOtpInputDto, PassengerVerifyOtpInputDto } from 'src/dtos/passenger.dto';
import { PassengerAuthGuard } from './auth.guard';

@ApiTags('Driver:Auth')
@Controller('auth')
@ApiBearerAuth('Authorization')
@UseGuards(PassengerAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class PassengerAuthController {
  constructor(private readonly passengerAuthService: PassengerAuthService) {}

  @Post('request-otp')
  @Public()
  @ApiOperation({ summary: 'request otp in app by phone number' })
  async requestOtp(@Body() body: PassengerRequestOtpInputDto) {
    const requestOtpData = await this.passengerAuthService.requestOtp(body);
    return requestOtpData;
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'verify otp sent to passenger phone number' })
  async requestVerify(
    @Body() body: PassengerVerifyOtpInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const verifyOtpData = await this.passengerAuthService.verifyOtp(body);
    return verifyOtpData;
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get passenger profile' })
  async getProfile(@Request() req) {
    return req.passenger;
  }
}
