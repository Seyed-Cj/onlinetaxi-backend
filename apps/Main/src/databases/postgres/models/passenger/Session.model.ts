import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'passenger_session',
  timestamps: true,
  freezeTableName: true,
})
export class PassengerSession extends Model {
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
    type: DataType.DATE,
    allowNull: false,
  })
  refreshExpiresAt?: Date;
}
