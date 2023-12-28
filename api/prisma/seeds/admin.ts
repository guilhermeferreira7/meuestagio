import bcryptService from '../../src/utils/bcriptUtils';

console.log('Adicionando usuário administrador');
export const admin = {
  email: process.env.ADMIN_EMAIL,
  name: 'Administrador',
  password: bcryptService.hashSync(process.env.ADMIN_PASSWORD),
};
