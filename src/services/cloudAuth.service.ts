import CloudUser from "../models/cloudUser.model";
import { hashPassword, comparePasswords } from "../utils/password";
import { getEmailHtml, sendEmail } from "../utils/email";
import { AppError } from "../errors/app-error";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import NotificationText from "../models/notificationText.model";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// requirement: alphanumeric + special char + min length = 10
function isValidPlatformPassword(password: string): boolean {
  if (!password || password.length < 10) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasLetter && hasNumber && hasSpecial;
}

type CloudJwtPayload = { userId: string };

async function getEmailTemplateByAction(action: string): Promise<string> {
  const tpl = await NotificationText.findOne({ where: { action } });
  if (!tpl?.emailText) {
    throw new AppError(`Missing email template for action: ${action}.`, 500);
  }
  return tpl.emailText;
}

export class CloudAuthService {
  static async register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    password2: string,
    telephone?: string
  ): Promise<boolean> {
    if (!firstname || !lastname || !email || !password || !password2) {
      throw new AppError(
        "All fields (firstname, lastname, email, password, password2) are required.",
        400
      );
    }

    if (!isValidEmail(email)) {
      throw new AppError("Email must be valid.", 400);
    }

    if (password !== password2) {
      throw new AppError("Passwords do not match.", 400);
    }

    if (!isValidPlatformPassword(password)) {
      throw new AppError(
        "Password must be alphanumeric + special char, min length = 10.",
        400
      );
    }

    const existing = await CloudUser.findOne({ where: { email } });
    if (existing) {
      throw new AppError("User with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await CloudUser.create({
      userId: uuidv4(),
      firstname,
      lastname,
      email,
      passwordHash,
      telephone: telephone ?? null,
      isConfirmed: false,
      hashReset: null,
    });

    const confirmToken = jwt.sign(
      { userId: user.userId } as CloudJwtPayload,
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    const confirmTemplate = await getEmailTemplateByAction("confirm email");
    const confirmHtml = getEmailHtml(confirmTemplate, {
      firstname,
      lastname,
      code: confirmToken,
    });

    await sendEmail({
      to: email,
      subject: "Keyello - Conferma registrazione",
      html: confirmHtml,
    });

    return true;
  }

  static async verifyEmail(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new AppError("Invalid or expired email verification token.", 400);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      throw new AppError("Invalid or expired email verification token.", 400);
    }

    if (typeof decoded === "string" || !decoded.userId) {
      throw new AppError("Invalid or expired email verification token.", 400);
    }

    const user = await CloudUser.findOne({ where: { userId: decoded.userId } });
    if (!user) {
      throw new AppError("User not found.", 422);
    }

    if (user.isConfirmed) {
      throw new AppError("Email already confirmed.", 400);
    }

    user.isConfirmed = true;
    await user.save();

    return { message: "Email successfully confirmed." };
  }

  static async login(email: string, password: string): Promise<{ token: string }> {
    if (!email || !password) {
      throw new AppError("All fields (email, password) are required.", 400);
    }

    if (!isValidEmail(email)) {
      throw new AppError("Email must be valid.", 400);
    }

    const user = await CloudUser.findOne({ where: { email } });
    if (!user) {
      throw new AppError("Invalid email or password.", 406);
    }

    const isMatch = await comparePasswords(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid email or password.", 406);
    }

    if (!user.isConfirmed) {
      throw new AppError("You must confirm your email before logging in.", 403);
    }

    const token = jwt.sign(
      { userId: user.userId } as CloudJwtPayload,
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    return { token };
  }

  static async sendResetPasswordEmail(email: string): Promise<void> {
    if (!email) {
      throw new AppError("Email is required.", 400);
    }

    if (!isValidEmail(email)) {
      throw new AppError("Email must be valid.", 400);
    }

    const user = await CloudUser.findOne({ where: { email } });
    if (!user) {
      throw new AppError("User not found.", 422);
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.hashReset = token;
    await user.save();

    const resetTemplate = await getEmailTemplateByAction("reset password");
    const resetHtml = getEmailHtml(resetTemplate, {
      firstname: user.firstname,
      lastname: user.lastname,
      code: token,
    });

    await sendEmail({
      to: user.email,
      subject: "Keyello - Reset password",
      html: resetHtml,
    });
  }

  static async resetPasswordWithToken(
  token: string,
  newPassword: string,
  newPassword2: string
): Promise<void> {
  if (!token || !newPassword || !newPassword2) {
    throw new AppError("Token, password and password2 are required.", 400);
  }

  if (newPassword !== newPassword2) {
    throw new AppError("Passwords do not match.", 400);
  }

  if (!isValidPlatformPassword(newPassword)) {
    throw new AppError(
      "Password must be alphanumeric + special char, min length = 10.",
      400
    );
  }

  const user = await CloudUser.findOne({ where: { hashReset: token } });
  if (!user) {
    throw new AppError("Invalid or expired token.", 422);
  }

  if (user.hashResetExpiresAt && user.hashResetExpiresAt.getTime() < Date.now()) {
    throw new AppError("Invalid or expired token.", 422);
  }

  user.passwordHash = await hashPassword(newPassword);
  user.hashReset = null;
  user.hashResetExpiresAt = null;
  await user.save();

  const updatedTemplate = await getEmailTemplateByAction("update password");
  const updatedHtml = getEmailHtml(updatedTemplate, {
    firstname: user.firstname,
    lastname: user.lastname,
  });

  await sendEmail({
    to: user.email,
    subject: "Keyello - Password aggiornata",
    html: updatedHtml,
  });
}

  
}
