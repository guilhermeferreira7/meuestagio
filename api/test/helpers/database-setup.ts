import { prisma } from '../../prisma/prisma';
import { Prisma } from '@prisma/client';

function formatModelName(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function clearDatabase() {
  try {
    await prisma.$transaction([
      ...Prisma.dmmf.datamodel.models.map((model) => {
        const modelName = formatModelName(model.name);
        return prisma[modelName].deleteMany();
      }),
    ]);
  } catch (error) {
    console.log(error);
  }
}
