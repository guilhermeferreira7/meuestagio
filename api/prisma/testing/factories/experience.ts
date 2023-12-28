import { faker } from '@faker-js/faker';
import { prisma } from '../../prisma';

export const createExperience = async (resumeId: number, company?: string) => {
  return await prisma.experience.create({
    data: {
      resumeId,
      company: company || faker.company.name(),
      position: faker.word.noun(),
      currentJob: false,
      description: faker.lorem.paragraph(),
      startDate: new Date(),
      endDate: new Date(),
    },
  });
};
