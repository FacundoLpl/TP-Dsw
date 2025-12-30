import bcrypt from 'bcrypt';


export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error("Password must not be empty");
  }
  return bcrypt.hash(password, 10);
};


export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  if (!plainPassword || !hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
};
