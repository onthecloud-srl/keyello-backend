import winston from "winston";
import ErrorLog from "../models/errorLog.model";


const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

export async function logErrorToDB(
    message: string,
    stack?: string,
    userId?: string,
    route?: string
) {
    try {
        await ErrorLog.create({
            message,
            stack,
            userId,
            route,
        });
    } catch (err) {
        console.error("Failed to log error to DB", err);
    }
}

export default logger;
