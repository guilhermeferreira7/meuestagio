import bcryptService from '../../src/utils/bcriptUtils';

console.log('Gerando usuário administrador...');
export const admin = {
  email: process.env.ADMIN_EMAIL,
  name: process.env.ADMIN_NAME,
  password: bcryptService.hashSync(process.env.ADMIN_PASSWORD),
};
