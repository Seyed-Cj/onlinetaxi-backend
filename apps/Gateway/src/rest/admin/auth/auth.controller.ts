import { Body, Controller, Post, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponeInterceptor } from 'src/response/response.interceptor';
import { AdminAuthService } from './auth.service';
import { AdminSignInInputDto } from 'src/dtos/admin.dto';
import type { Response } from 'express';

@ApiTags('Admin:Auth')
@Controller('auth')
@ApiBadRequestResponse({ description: 'Bad request | Bad inputs' })
@ApiUnauthorizedResponse({ description: 'Session is expired | Unauthorized' })
@ApiForbiddenResponse({ description: 'Permission denied | No Access | Not Subscribed' })
@ApiUnsupportedMediaTypeResponse({ description: 'Content|Context format is not supported or invalid' })
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponeInterceptor)
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Signin to admin panel by username and password' })
  async signin(
    @Body() body: AdminSignInInputDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const signInData = await this.authService.signin(body);
    const tokenData = signInData.tokenData;
    res.cookie(tokenData.name, tokenData.token, { maxAge: tokenData.ttl, httpOnly: true });
    delete signInData.tokenData;
    return signInData;
  }
}
