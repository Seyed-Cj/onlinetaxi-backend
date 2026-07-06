import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'driver_session',
  timestamps: true,
  freezeTableName: true,
})
export class DriverSession extends Model {
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
  driverId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  refreshExpiresAt?: Date;
}
