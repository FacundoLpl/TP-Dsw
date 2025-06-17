import bcrypt from 'bcrypt';

export const hashPassword = (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, 10);
};

export const comparePassword = (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
