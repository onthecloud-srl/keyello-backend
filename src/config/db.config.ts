import { Dialect } from "sequelize";
import { KEYELLO } from "../types/db.types";

interface DbConfig {
  HOST: string;
  USER: string;
  PASSWORD: string;
  DB: string;
  dialect: Dialect;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

const commonConfig = {
  HOST: process.env.DB_HOST!,
  USER: process.env.DB_USER!,
  PASSWORD: process.env.DB_PASS!,
  dialect: "mysql" as Dialect,
  pool: {
    max: 100,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
};

const dbConfigs: { [key: string]: DbConfig } = {
  keyello: { ...commonConfig, DB: KEYELLO },
};

export default dbConfigs;
