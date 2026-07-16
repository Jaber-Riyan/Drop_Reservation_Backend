import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database/sequelize';
import { IPurchase, IPurchaseCreation } from './purchase.interface';
import User from '../user/user.model';
import Drop from '../drop/drop.model';

/**
 * Purchase model - represents the purchases table in PostgreSQL.
 *
 * A Purchase is created from an ACTIVE Reservation.
 * It does NOT modify availableStock (already decremented during reservation).
 * No updatedAt — only createdAt is tracked.
 *
 * Business logic (validation, transactions) belongs in the Service layer.
 */
class Purchase extends Model<IPurchase, IPurchaseCreation> {
  declare id: number;
  declare userId: number;
  declare dropId: number;
  declare reservationId: number;
  declare createdAt: Date;
}

Purchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    dropId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'drops',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    reservationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'reservations',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'purchases',
    timestamps: true,
    updatedAt: false, // Purchase does not have updatedAt
  }
);

// Associations
// Purchase belongs to a single User (the buyer)
Purchase.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Purchase belongs to a single Drop (the purchased item)
Purchase.belongsTo(Drop, { foreignKey: 'dropId', as: 'drop' });

export default Purchase;