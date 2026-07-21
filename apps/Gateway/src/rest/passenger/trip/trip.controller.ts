import {
  Body,
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { PassengerAuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { CreateTripInputDto } from 'src/dtos/trip.dto';
import { PassengerTripService } from './trip.service';

@ApiTags('Passenger:Trip')
@ApiBearerAuth('Authorization')
@Controller('trip')
@UseGuards(PassengerAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class PassengerTripController {
  constructor(private readonly tripService: PassengerTripService) {}

  @Post()
  @ApiOperation({ summary: 'passenger create new trip' })
  async createTrip(@Body() body: CreateTripInputDto, @Request() req) {
    return this.tripService.createTrip({
      passengerId: req.passenger.id,
      ...body,
    });
  }
}
