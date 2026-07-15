import { Optional } from 'sequelize';

/**
 * Purchase attributes representing the shape of a Purchase record in the database.
 */
export interface IPurchase {
  id: number;
  userId: number;
  dropId: number;
  reservationId: number;
  createdAt: Date;
}

/**
 * Interface for creating a new Purchase.
 * id and createdAt are auto-generated.
 */
export interface IPurchaseCreation extends Optional<IPurchase, 'id' | 'createdAt'> {}