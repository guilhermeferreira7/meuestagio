import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';
import { createRegion } from './region';

export const createCity = async () => {
  const region = await createRegion();

  return await prisma.city.create({
    data: {
      IBGECityCode: Number(faker.string.numeric(7)),
      name: faker.internet.userName(),
      state: faker.location.state(),
      region: {
        connect: region,
      },
    },
  });
};
