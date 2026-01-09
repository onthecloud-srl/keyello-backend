import crypto from "crypto";
import bcrypt from "bcrypt";

export function encryptPassword(password: string, secretKey: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let encryptedPassword = cipher.update(password, "utf-8", "hex");
  encryptedPassword += cipher.final("hex");
  return iv.toString("hex") + encryptedPassword;
}

export function decryptPassword(encryptedPassword: string, secretKey: string) {
  const iv = Buffer.from(encryptedPassword.slice(0, 32), "hex");
  const encryptedData = encryptedPassword.slice(32);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let decryptedPassword = decipher.update(encryptedData, "hex", "utf-8");
  decryptedPassword += decipher.final("utf-8");
  return decryptedPassword;
}

export function generatePassword(length: number): string {
  const charsetLower = "abcdefghijklmnopqrstuvwxyz";
  const charsetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charsetNumbers = "0123456789";
  const charset = charsetLower + charsetUpper + charsetNumbers;

  if (length < 3) {
    throw new Error("Password length must be at least 3 characters.");
  }

  let password = "";

  password += charsetLower[Math.floor(Math.random() * charsetLower.length)];

  password += charsetUpper[Math.floor(Math.random() * charsetUpper.length)];

  password += charsetNumbers[Math.floor(Math.random() * charsetNumbers.length)];

  for (let i = 3; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

export function generaPassword(): string {
  const lettereMaiuscole = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lettereMinuscole = 'abcdefghijklmnopqrstuvwxyz';
  const numeri = '0123456789';
  const caratteriSpeciali = '!@#$^&*?_~';

  let password = '';
  password += lettereMaiuscole.charAt(Math.floor(Math.random() * lettereMaiuscole.length));
  password += lettereMinuscole.charAt(Math.floor(Math.random() * lettereMinuscole.length));

  const randomChoice = Math.random();
  if (randomChoice < 0.5) {
    password += numeri.charAt(Math.floor(Math.random() * numeri.length));
    password += caratteriSpeciali.charAt(Math.floor(Math.random() * caratteriSpeciali.length));
    password += caratteriSpeciali.charAt(Math.floor(Math.random() * caratteriSpeciali.length));
  } else {
    password += numeri.charAt(Math.floor(Math.random() * numeri.length));
    password += numeri.charAt(Math.floor(Math.random() * numeri.length));
    password += numeri.charAt(Math.floor(Math.random() * numeri.length));
    password += caratteriSpeciali.charAt(Math.floor(Math.random() * caratteriSpeciali.length));
  }

  const allCharacters = lettereMaiuscole + lettereMinuscole + numeri + caratteriSpeciali;
  while (password.length < 8) {
    password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }

  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  return password;
}

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};