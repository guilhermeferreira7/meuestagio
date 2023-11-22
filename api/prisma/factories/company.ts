import { faker } from '@faker-js/faker';

import { prisma } from '../prisma';
import { createCity } from './city';
import bcryptService from '../../src/utils/bcriptUtils';

export const createCompany = async () => {
  const city = await createCity();

  return await prisma.company.create({
    data: {
      name: 'Company Test',
      email: faker.internet.email(),
      password: bcryptService.hashSync('123123'),
      cnpj: faker.string.numeric(14),
      city: {
        connect: city,
      },
    },
  });
};

export const createManyCompanies = async (length: number) => {
  const companies = Array.from({ length }).map(async () => {
    return await createCompany();
  });

  return await Promise.all(companies);
};
