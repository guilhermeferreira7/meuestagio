import { prisma } from '../src/prisma';
import { areas } from './seeds/areas';
import { admin } from './seeds/admin';
import { CityIBGE, createRegion, getCities } from './seeds/cities';

async function main() {
  const region = await createRegion();
  const cities = await getCities(region.IBGECode);

  await prisma.$transaction([
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
      create: {
        email: admin.email,
        name: admin.name,
        password: admin.password,
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
          regionId: region.id,
        },
      });
    })),
  ]);
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
