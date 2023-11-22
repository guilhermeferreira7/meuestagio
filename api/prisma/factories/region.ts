import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';

export const createRegion = async () => {
  return await prisma.region.create({
    data: {
      IBGECode: Number(faker.string.numeric(5)),
      name: `Região ${faker.string.uuid()}`,
      state: `Estado ${faker.string.uuid()}`,
    },
  });
};
