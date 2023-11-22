import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';

export const createArea = async () => {
  return await prisma.area.create({
    data: {
      cnpqId: Number(faker.string.numeric(5)),
      title: `Área ${faker.string.uuid()}`,
    },
  });
};
