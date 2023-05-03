import * as bcrypt from 'bcryptjs';

const bcryptService = {
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, parseInt(process.env.BCRYPT_SALT));
  },

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue);
  },

  hashSync(value: string): string {
    return bcrypt.hashSync(value, parseInt(process.env.BCRYPT_SALT));
  },

  compareSync(value: string, hashedValue: string): boolean {
    return bcrypt.compareSync(value, hashedValue);
  },
};

export default bcryptService;
