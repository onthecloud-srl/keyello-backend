import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import logger, { logErrorToDB } from "../utils/logger";


export interface AuthenticatedRequest extends Request {
  user?: { userid: string; isAdmin: boolean };
}

export function errorHandler(
  err: any,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  logger.error(message, {
    stack: err.stack,
    route: req.originalUrl,
    userId: req.user?.userid,
  });

  if (!isAppError || statusCode >= 500) {
    logErrorToDB(message, err.stack, req.user?.userid, req.originalUrl);
  }

  const responseBody: any = { message };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
}
