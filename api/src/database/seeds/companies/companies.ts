import bcryptService from '../../../utils/bcriptUtils';

export const companies = [
  {
    name: 'Google',
    email: 'google@gmail.com',
    password: bcryptService.hashSync('123456'),
  },
  {
    name: 'Facebook',
    email: 'facebook@email.com',
    password: bcryptService.hashSync('123456'),
  },
  {
    name: 'Amazon',
    email: 'amazon@email.com',
    password: bcryptService.hashSync('123456'),
  },
];
