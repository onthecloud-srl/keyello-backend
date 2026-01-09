import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { keyelloSequelize } from "./db.index";

class CloudUser extends Model<
  InferAttributes<CloudUser>,
  InferCreationAttributes<CloudUser>
> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare passwordHash: string;
  declare telephone: string | null;
  declare isConfirmed: boolean;
  declare hashReset: string | null;
  declare hashResetExpiresAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CloudUser.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "user_id",
      unique: true,
    },

    firstname: { type: DataTypes.STRING(100), allowNull: false },
    lastname: { type: DataTypes.STRING(100), allowNull: false },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },

    telephone: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: null,
    },

    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_confirmed",
    },

    hashReset: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: null,
      field: "hash_reset",
    },

    hashResetExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "hash_reset_expires_at",
    },

    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  {
    sequelize: keyelloSequelize,
    tableName: "cloud_users",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["user_id"] },
      { fields: ["hash_reset"] },
    ],
  }
);

export default CloudUser;
