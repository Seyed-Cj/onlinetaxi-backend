import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'driver',
  timestamps: true,
  freezeTableName: true,
})
export class Driver extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  carModel?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  carColor?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  plateNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  isActive?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  isOnline?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  isVerified?: string;
}
