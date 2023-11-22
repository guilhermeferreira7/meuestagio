import { faker } from '@faker-js/faker';
import { prisma } from '../prisma';
import bcryptService from '../../src/utils/bcriptUtils';

export async function createUser() {
  return await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: bcryptService.hashSync('123123'),
      name: faker.person.fullName(),
    },
  });
}
