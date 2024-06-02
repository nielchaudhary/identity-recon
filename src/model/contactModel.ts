import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Contact',
  timestamps: true,
  modelName : "Contact"
})
export class Contact extends Model<Contact> {
  @Column({
    type: DataType.INTEGER, 
    autoIncrement: true,
    primaryKey: true,
  })
  id! : number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email!: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    references: {
      model: 'Contact',
      key: 'id',
    },
  })
  linkedId!: number | null;

  @Column({
    type: DataType.ENUM('primary', 'secondary'),
    allowNull: false,
  })
  linkPrecedence!: 'primary' | 'secondary';

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt!: Date | null;
}
