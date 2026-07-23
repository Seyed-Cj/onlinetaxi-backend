import { HttpStatus, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
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

  async accept({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            status: 'REQUESTED',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvErr(
            HttpStatus.CONFLICT,
            'Trip already accepted or not found',
          );
        }

        await trip.update(
          {
            driverId,
            status: 'ACCEPTED',
            acceptedAt: new Date(),
          },
          { transaction },
        );

        return {
          message: 'Trip accepted succesfully',
          data: trip,
        };
      },
    );
  }

  async arrived({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            driverId,
            status: 'ACCEPTED',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvErr(
            HttpStatus.CONFLICT,
            'trip not found or driver not authorized to mark as arrived',
          );
        }

        await trip.update(
          {
            status: 'DRIVER_ARRIVED',
            arrivedAt: new Date(),
          },
          { transaction },
        );

        return {
          message: 'Driver arrived successfully!',
          data: trip,
        };
      },
    );
  }

  async start({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            driverId,
            status: 'DRIVER_ARRIVED',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvErr(
            HttpStatus.CONFLICT,
            'Trip not found or driver not authorized to start the trip',
          );
        }

        await trip.update(
          {
            status: 'IN_PROGRESS',
            startedAt: new Date(),
          },
          { transaction },
        );

        return {
          message: 'Trip started successfully!',
          data: trip,
        };
      },
    );
  }

  async finish({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvErr(HttpStatus.BAD_REQUEST, 'Invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            driverId,
            status: 'IN_PROGRESS',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvErr(
            HttpStatus.CONFLICT,
            'Trip not found or driver not authorized to finish the trip',
          );
        }

        await trip.update(
          {
            status: 'FINISHED',
            finishedAt: new Date(),
          },
          { transaction },
        );

        return {
          message: 'Trip finished successfully!',
          data: trip,
        };
      },
    );
  }
}
