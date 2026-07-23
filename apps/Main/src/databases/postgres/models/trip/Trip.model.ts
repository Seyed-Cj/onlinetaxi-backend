import { DataType, Table, Column, Model } from 'sequelize-typescript';

enum TripStatus {
  REQUESTED = 'REQUESTED',       
  SEARCHING = 'SEARCHING',       
  ACCEPTED = 'ACCEPTED',         
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  STARTED = 'TRIP_IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'trip',
  timestamps: true,
  freezeTableName: true,
})
export class Trip extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  passengerId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  driverId?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  originLat?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  originLng?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  destinationLat?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  destinationLng?: number;

  @Column({
    type: DataType.ENUM(...Object.values(TripStatus)),
    allowNull: false,
    defaultValue: TripStatus.REQUESTED,
  })
  status?: TripStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priceEstimate?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  acceptedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  arrivedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  finishedAt?: Date;
}