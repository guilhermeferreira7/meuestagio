import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';

export const createArea = async () => {
  return await prisma.area.create({
    data: {
      cnpqId: Number(faker.string.numeric(7)),
      title: `Área ${faker.string.uuid()}`,
    },
  });
};

export async function createManyAreas(quantity: number) {
  const areas = [];

  for (let i = 0; i < quantity; i++) {
    areas.push(createArea());
  }

  return await Promise.all(areas);
}
