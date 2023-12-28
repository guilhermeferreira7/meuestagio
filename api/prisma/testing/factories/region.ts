import { prisma } from '../../prisma';
import { faker } from '@faker-js/faker';

export const createRegion = async () => {
  return await prisma.region.create({
    data: {
      IBGECode: Number(faker.string.numeric(7)),
      name: faker.location.street(),
      state: faker.location.state() + faker.string.numeric(5), // avoid duplicate state names
    },
  });
};

export async function createManyRegions(quantity: number) {
  const regions = [];
  for (let i = 0; i < quantity; i++) {
    regions.push(createRegion());
  }
  return await Promise.all(regions);
}
