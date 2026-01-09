import { AppError } from "../errors/app-error";
import CloudUser from "../models/cloudUser.model";

export class CloudUserService {

     static async me(userId: string): Promise<{
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    telephone: string | null;
    isConfirmed: boolean;
  }> {
    const user = await CloudUser.findOne({ where: { userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return {
      userId: user.userId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      telephone: user.telephone,
      isConfirmed: user.isConfirmed,
    };
  }

static async updateMe(
  userId: string,
  firstname?: string,
  lastname?: string,
  telephone?: string
): Promise<{ message: string }> {
  const user = await CloudUser.findOne({ where: { userId } });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const hasFirstname = firstname !== undefined;
  const hasLastname = lastname !== undefined;
  const hasTelephone = telephone !== undefined;

  if (!hasFirstname && !hasLastname && !hasTelephone) {
    throw new AppError("Nothing to update.", 400);
  }

  if (hasFirstname) {
    if (!firstname || firstname.trim().length === 0) {
      throw new AppError("firstname must be a non-empty string.", 400);
    }
    user.firstname = firstname.trim();
  }

  if (hasLastname) {
    if (!lastname || lastname.trim().length === 0) {
      throw new AppError("lastname must be a non-empty string.", 400);
    }
    user.lastname = lastname.trim();
  }

  if (hasTelephone) {
    user.telephone = telephone ? telephone.trim() : null;
  }

  await user.save();
  return { message: "Account updated successfully." };
}

}