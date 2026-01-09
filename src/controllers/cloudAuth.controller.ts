import { Request, Response, NextFunction } from "express";
import { CloudAuthService } from "../services/cloudAuth.service";

export class CloudAuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstname, lastname, email, password, password2, telephone } = req.body;
      const result = await CloudAuthService.register(firstname, lastname, email, password, password2, telephone);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await CloudAuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await CloudAuthService.sendResetPasswordEmail(email);
      res.status(200).json({ message: "Reset link sent to your email." });
    } catch (error) {
      next(error);
    }
  }

static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password, password2 } = req.body;
    await CloudAuthService.resetPasswordWithToken(token, password, password2);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
}

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.body;
    const result = await CloudAuthService.verifyEmail(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
}


