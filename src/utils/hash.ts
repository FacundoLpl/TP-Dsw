import bcrypt from 'bcrypt';

/*export const hashPassword = (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, 10);
};*/
export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error("Password must not be empty");
  }
  return bcrypt.hash(password, 10);
};

/*
export const comparePassword = (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};*/

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  if (!plainPassword || !hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
};
