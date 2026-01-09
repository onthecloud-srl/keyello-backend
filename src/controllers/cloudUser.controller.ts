import { Request, Response, NextFunction } from "express";
import { CloudUserService } from "../services/cloudUser.service";

export class CloudUserController {

      static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const userId = (req as any).cloudUserId as string;
          const result = await CloudUserService.me(userId);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    
    static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = (req as any).cloudUserId as string;
        const { firstname, lastname, telephone } = req.body;
        const result = await CloudUserService.updateMe(userId, firstname, lastname, telephone);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
    }
}