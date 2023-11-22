import { Prisma } from '@prisma/client';
import { createInstitution } from './institution';
import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';
import { createArea } from './area';

export const createCourse = async () => {
  const institution = await createInstitution();
  const area = await createArea();

  return await prisma.course.create({
    data: {
      name: `Curso ${faker.string.uuid()}}`,
      institution: { connect: institution },
      area: { connect: area },
    },
  });
};
