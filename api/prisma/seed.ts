import { prisma } from './prisma';
import { areas } from './seeds/areas';
import { admin } from './seeds/admin';
import { CityIBGE, getCities, region } from './seeds/cities';

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

    ...(await cities.map((city: CityIBGE) => {
      return prisma.city.upsert({
        where: { IBGECityCode: city.id },
        update: {},
        create: {
          IBGECityCode: city.id,
          name: city.nome,
          state: city.microrregiao.mesorregiao.UF.nome,
          region: {
            connect: {
              IBGECode: 41029,
            },
          },
        },
      });
    })),
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
