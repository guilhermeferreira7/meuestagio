import { prisma } from '../prisma';

global.afterAll(async () => {
  await prisma.$disconnect();
});
