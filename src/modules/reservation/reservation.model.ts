import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database/sequelize';
import { IReservation, IReservationCreation, ReservationStatus } from './reservation.interface';

/**
 * Reservation model - represents the reservations table in PostgreSQL.
 *
 * A Reservation is created when a user reserves a Drop.
 * It locks the stock for 60 seconds (expiresAt = createdAt + 60s).
 * Status transitions: ACTIVE → PURCHASED | EXPIRED
 *
 * Business logic (stock checks, atomic transactions) belongs
 * in the Service layer, not the Model.
 */
class Reservation extends Model<IReservation, IReservationCreation> {
  declare id: number;
  declare userId: number;
  declare dropId: number;
  declare status: ReservationStatus;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Reservation.init(
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
    status: {
      type: DataTypes.ENUM(...Object.values(ReservationStatus)),
      allowNull: false,
      defaultValue: ReservationStatus.ACTIVE,
    },
    expiresAt: {
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
    tableName: 'reservations',
    timestamps: true,
  }
);

export default Reservation;