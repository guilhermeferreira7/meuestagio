import { faker } from '@faker-js/faker';
import { prisma } from '../../prisma';
import bcryptService from '../../../src/utils/bcriptUtils';
import { createCourse } from './course';

export async function createProfessor() {
  const course = await createCourse();

  return await prisma.professor.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: bcryptService.hashSync('123123'),
      courseId: course.id,
    },
  });
}
