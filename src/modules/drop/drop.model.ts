import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database/sequelize';
import { IDrop, IDropCreation } from './drop.interface';

/**
 * Drop model - represents the drops table in PostgreSQL.
 *
 * A Drop represents a product release with a limited stock.
 * availableStock starts equal to initialStock and is later
 * decremented by the Reservation system.
 *
 * Business logic (like syncing availableStock with initialStock)
 * belongs in the Service layer, not the Model.
 */
class Drop extends Model<IDrop, IDropCreation> {
  declare id: number;
  declare name: string;
  declare category: string;
  declare initialStock: number;
  declare availableStock: number;
  declare startsAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Drop.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    initialStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // initialStock cannot be negative
      },
    },
    availableStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'drops',
    timestamps: true,
  }
);

export default Drop;