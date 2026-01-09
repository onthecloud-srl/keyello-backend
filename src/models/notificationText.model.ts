import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { keyelloSequelize } from "./db.index";

class NotificationText extends Model<
  InferAttributes<NotificationText>,
  InferCreationAttributes<NotificationText>
> {
  declare id: CreationOptional<number>;
  declare action: string;
  declare emailText?: string;
}

NotificationText.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emailText: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      field: "email_text",
    },
  },
  {
    sequelize: keyelloSequelize,
    tableName: "cloud_notification_text",
    freezeTableName: true,
    timestamps: false,
  }
);

export default NotificationText;
