import {
  Controller,
  Param,
  Post,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverAuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { DriverTripService } from './trip.service';

@ApiTags('Driver:Trip')
@Controller('trips')
@ApiBearerAuth('Authorization')
@UseGuards(DriverAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class DriverTripController {
  constructor(private readonly tripService: DriverTripService) {}

  @Post(':tripId/accept')
  @ApiOperation({ summary: 'accept a trip' })
  async acceptTrip(@Param('tripId') tripId: string, @Request() req) {
    return this.tripService.acceptTrip({
      tripId,
      driverId: req.driver.id,
    });
  }
}
