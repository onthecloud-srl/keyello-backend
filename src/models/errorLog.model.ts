import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import { keyelloSequelize } from "./db.index";

class ErrorLog extends Model<
    InferAttributes<ErrorLog>,
    InferCreationAttributes<ErrorLog>
> {
    declare id: CreationOptional<number>;
    declare message: string;
    declare stack?: string;
    declare userId?: string;
    declare route?: string;
}

ErrorLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        stack: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        route: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: keyelloSequelize,
        tableName: "error_logs",
        freezeTableName: true,
    }
)

export default ErrorLog