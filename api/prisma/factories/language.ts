import { faker } from '@faker-js/faker';

import { prisma } from '../prisma';

export async function createLanguage(resumeId: number, name?: string) {
  return prisma.language.create({
    data: {
      resumeId,
      name: name || faker.lorem.word(),
      level: 'Basico',
    },
  });
}
