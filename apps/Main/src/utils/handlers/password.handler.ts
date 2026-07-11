import bcrypt from 'bcryptjs';

export const generate = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return { password, salt, hash };
};

export const validate = async (
  password: string,
  salt: string,
  hash: string,
) => {
  try {
    const _hash = await bcrypt.hash(password, salt);
    if (_hash == hash) return true;
    else return false;
  } catch (e) {
    return false;
  }
};
