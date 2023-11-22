import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';
import { createCity } from './city';

export const createInstitution = async () => {
  const city = await createCity();

  return await prisma.institution.create({
    data: {
      name: `Instituição ${faker.string.uuid()}`,
      city: { connect: city },
    },
  });
};
