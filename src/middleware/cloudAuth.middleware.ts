import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";

export function cloudAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) throw new AppError("Unauthorized.", 401);

    const token = auth.replace("Bearer ", "").trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "string" || !(decoded as any).userId) {
      throw new AppError("Unauthorized.", 401);
    }

    (req as any).cloudUserId = (decoded as any).userId as string;
    next();
  } catch {
    next(new AppError("Unauthorized.", 401));
  }
}
