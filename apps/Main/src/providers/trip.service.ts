import { HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvErr,
} from 'src/services/dto';

@Injectable()
export class TripService {
  constructor(private readonly pg: PostgresService) {}

  async create({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const {
      passengerId,
      originLat,
      originLng,
      destinationLat,
      destinationLng,
    } = query;

    if (!passengerId) {
      throw new SrvErr(HttpStatus.UNAUTHORIZED, 'Passenger not authorized');
    }

    const trip = await this.pg.models.Trip.create({
      passengerId,
      originLat,
      originLng,
      destinationLat,
      destinationLng,
      status: 'REQUESTED',
    });

    return {
      message: 'Trip created successfully',
      data: trip,
    };
  }
}
