import bcryptService from '../../../utils/bcriptUtils';

export const students = [
  {
    name: 'John Doe',
    email: 'John@email.com',
    password: bcryptService.hashSync('123123'),
  },
  {
    name: 'Jane Doe',
    email: 'Jane@email.com',
    password: bcryptService.hashSync('123123'),
  },
  {
    name: 'Guilherme Ferreira',
    email: 'guilherme@email.com',
    password: bcryptService.hashSync('123123'),
  },
];
