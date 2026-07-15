import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database/sequelize';
import { IUser, IUserCreation } from './user.interface';

/**
 * User model - represents the users table in PostgreSQL.
 *
 * Uses the Sequelize Model class with a clean class-based definition.
 * This model is intentionally kept simple with no business logic.
 * Business logic belongs in the Service layer, not the Model.
 *
 * The model is initialized by calling User.init() which registers
 * the schema with the Sequelize instance.
 * createdAt and updatedAt timestamps are managed by Sequelize automatically.
 */
class User extends Model<IUser, IUserCreation> {
  declare id: number;
  declare username: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
    tableName: 'users',
    timestamps: true,
  }
);

export default User;