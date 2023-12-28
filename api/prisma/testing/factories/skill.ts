import { faker } from '@faker-js/faker';
import { prisma } from '../../prisma';

export async function createSkill(resumeId: number, name?: string) {
  return await prisma.skill.create({
    data: {
      resumeId,
      name: name || faker.lorem.word(),
      level: 'Avancado',
    },
  });
}
