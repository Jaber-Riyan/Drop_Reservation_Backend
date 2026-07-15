import { Optional } from 'sequelize';

/**
 * Drop attributes representing the shape of a Drop record in the database.
 *
 * availableStock is included in the full interface but should NOT be
 * directly settable through the API - it's managed internally by the service.
 */
export interface IDrop {
  id: number;
  name: string;
  category: string;
  initialStock: number;
  availableStock: number;
  startsAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for creating a new Drop.
 * id, createdAt, and updatedAt are auto-generated.
 * availableStock is omitted from creation - it's set automatically
 * to equal initialStock by the service layer.
 */
export interface IDropCreation extends Optional<IDrop, 'id' | 'availableStock' | 'createdAt' | 'updatedAt'> {}

/**
 * Interface for updating a Drop.
 * availableStock is excluded because it should never be manually editable.
 */
export interface IDropUpdate {
  name?: string;
  category?: string;
  initialStock?: number;
  startsAt?: Date;
}