import { faker } from '@faker-js/faker';

import { prisma } from '../../prisma';

export const createEducation = async (resumeId: number, school?: string) => {
  return prisma.education.create({
    data: {
      resumeId,
      degree: 'EnsinoMedio',
      fieldOfStudy: 'fieldOfStudy',
      school: school || faker.person.fullName(),
      endDate: new Date(),
      startDate: new Date(),
    },
  });
};
