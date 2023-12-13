import { prisma } from './prisma';
import { areas } from './seeds/areas';
import { admin } from './seeds/admin';
import { getCities, region } from './seeds/cities';
import { City } from '@prisma/client';

async function main() {
  const cities = await getCities(41029);

  const seeds = await prisma.$transaction([
    ...areas.map((area) =>
      prisma.area.upsert({
        where: { cnpqId: area.cnpqId },
        update: {},
        create: area,
      }),
    ),

    prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: admin,
    }),

    prisma.region.upsert({
      create: {
        IBGECode: region.IBGECode,
        name: region.name,
        state: region.state,
      },
      update: {},
      where: {
        IBGECode: region.IBGECode,
      },
    }),

    ...cities.map((city: City) => {
      return prisma.city.upsert({
        where: { IBGECityCode: city.IBGECityCode },
        update: {},
        create: {
          IBGECityCode: city.IBGECityCode,
          name: city.name,
          state: city.state,
          region: {
            connect: {
              IBGECode: 41029,
            },
          },
        },
      });
    }),
  ]);

  console.log(`${seeds.length} dados inseridos.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
