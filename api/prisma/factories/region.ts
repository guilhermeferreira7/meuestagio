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

export async function createManyRegions(quantity: number) {
  const regions = [];
  for (let i = 0; i < quantity; i++) {
    regions.push(createRegion());
  }
  return await Promise.all(regions);
}
