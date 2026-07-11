import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { AdminAuthService } from './auth.service';
import {
  AdminSignInInputDto,
  GetAdminProfileOutputDto,
} from 'src/dtos/admin.dto';
import type { Response } from 'express';
import type { RequestWithUserData } from 'src/dtos/public.dto';
import { AdminAuthGuard } from './auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Admin:Auth')
@UseGuards(AdminAuthGuard)
@ApiCookieAuth()
@Controller('auth')
@ApiBadRequestResponse({ description: 'Bad request | Bad inputs' })
@ApiUnauthorizedResponse({ description: 'Session is expired | Unauthorized' })
@ApiForbiddenResponse({
  description: 'Permission denied | No Access | Not Subscribed',
})
@ApiUnsupportedMediaTypeResponse({
  description: 'Content|Context format is not supported or invalid',
})
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('signin')
  @Public()
  @ApiOperation({ summary: 'Signin to admin panel by username and password' })
  async signin(
    @Body() body: AdminSignInInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetAdminProfileOutputDto> {
    const signInData = await this.authService.signin(body);
    const tokenData = signInData.tokenData;
    res.cookie(tokenData.name, tokenData.token, {
      maxAge: tokenData.ttl,
      httpOnly: true,
    });
    delete signInData.tokenData;
    return signInData;
  }
  @Get('profile')
  @ApiOperation({ summary: 'Get admin profile (guarded)' })
  async getProfile(
    @Req() req: RequestWithUserData,
  ): Promise<GetAdminProfileOutputDto> {
    return {
      userType: 'ADMIN',
      profile: req.acc_profile,
      session: req.acc_session,
    };
  }
}
