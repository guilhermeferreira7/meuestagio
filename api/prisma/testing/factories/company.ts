import { faker } from '@faker-js/faker';

import { createCity } from './city';
import bcryptService from '../../../src/utils/bcriptUtils';
import { prisma } from '../../prisma';

export const createCompany = async () => {
  const city = await createCity();

  return await prisma.company.create({
    data: {
      name: 'Company Test',
      email: faker.internet.email(),
      password: bcryptService.hashSync('123123'),
      cnpj: faker.string.numeric(14),
      phone: faker.phone.number(),
      city: {
        connect: city,
      },
    },
    include: {
      city: true,
    },
  });
};

export const createManyCompanies = async (length: number) => {
  const companies = [];

  for (let i = 0; i < length; i++) {
    companies.push(createCompany());
  }

  return await Promise.all(companies);
};
