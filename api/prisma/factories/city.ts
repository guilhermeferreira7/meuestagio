import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';
import { createRegion } from './region';
import { Prisma } from '@prisma/client';

type CreateCity = Partial<Prisma.CityCreateInput>;

export const createCity = async (data?: CreateCity) => {
  const region = await createRegion();

  return await prisma.city.create({
    data: {
      IBGECityCode: Number(faker.string.numeric(7)),
      name: data?.name ? data.name : faker.internet.userName(),
      state: data?.state ? data.state : faker.location.state(),
      region: {
        connect: region,
      },
    },
  });
};

export const createManyCities = async (quantity: number) => {
  const cities = [];

  for (let i = 0; i < quantity; i++) {
    cities.push(createCity());
  }

  return await Promise.all(cities);
};
