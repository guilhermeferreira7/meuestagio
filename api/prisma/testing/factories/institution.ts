import { prisma } from '../../prisma';
import { faker } from '@faker-js/faker';
import { createCity } from './city';

export const createInstitution = async (name?: string) => {
  const city = await createCity();

  return await prisma.institution.create({
    data: {
      name: name ? name : `Instituição ${faker.string.uuid()}`,
      city: { connect: city },
    },
    include: { city: true },
  });
};

export async function createManyInstitutions(quantity: number) {
  const institutions = [];

  for (let i = 0; i < quantity; i++) {
    institutions.push(createInstitution());
  }

  return await Promise.all(institutions);
}
