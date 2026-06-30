import bcrypt from "bcrypt";
import env from "../../env.js";

export const hashPasswords = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

export const comparedPasswords = async (
  password: string,
  hasshedPasswod: string,
) => {
  return bcrypt.compare(password, hasshedPasswod);
};
