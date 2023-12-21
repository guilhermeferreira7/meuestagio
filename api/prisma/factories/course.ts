import { createInstitution } from './institution';
import { prisma } from '../prisma';
import { faker } from '@faker-js/faker';
import { createArea } from './area';

export async function createCourse(name?: string) {
  const institution = await createInstitution();
  const area = await createArea();

  return await prisma.course.create({
    data: {
      name: name ?? `Curso ${faker.string.uuid()}}`,
      institution: { connect: institution },
      area: { connect: area },
    },
    include: {
      institution: true,
      area: true,
    },
  });
}

export async function createManyCourses(quantity: number) {
  const courses = [];

  for (let i = 0; i < quantity; i++) {
    courses.push(createCourse());
  }

  return await Promise.all(courses);
}
