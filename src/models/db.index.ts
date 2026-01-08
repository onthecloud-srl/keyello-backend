import { Sequelize } from "sequelize";
import dbConfigs from "../config/db.config";
import "dotenv/config";

const sequelizeInstances: { [key: string]: Sequelize } = {};

const showHidden = (s = "") =>
  s
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/ /g, "␠");
const maskPass = (s = "") => {
  const v = showHidden(s || "");
  return v.length <= 2
    ? "*".repeat(v.length)
    : "*".repeat(v.length - 2) + v.slice(-2);
};

for (const [key, config] of Object.entries(dbConfigs)) {
  console.log(`[DB:${key}] Initializing connection...`, {
    host: config.HOST,
    user: config.USER,
    db: config.DB,
    passPreview: maskPass(config.PASSWORD || ""),
  });

  const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
    timezone: "+01:00",
    logging: false,
    dialectOptions: {
      connectTimeout: 20000,
    },
  });

  sequelizeInstances[key] = sequelize;
}

export const keyelloSequelize = sequelizeInstances["keyello"];
