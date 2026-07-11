import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'admin_session',
  timestamps: true,
  freezeTableName: true,
})
export class AdminSession extends Model {
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
  adminId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  refreshExpiresAt?: Date;
}
