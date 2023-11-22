import { prisma } from '../prisma';
import { createCity } from './city';
import { createInstitution } from './institution';
import { createCourse } from './course';
import bcryptService from '../../src/utils/bcriptUtils';
import { faker } from '@faker-js/faker/locale/af_ZA';
import { createResume } from './resume';

export const createStudent = async () => {
  const city = await createCity();
  const institution = await createInstitution();
  const course = await createCourse();
  const resume = await createResume();

  return await prisma.student.create({
    data: {
      name: 'Student Test',
      email: faker.internet.email(),
      password: bcryptService.hashSync('123123'),
      city: {
        connect: city,
      },
      course: {
        connect: course,
      },
      institution: {
        connect: institution,
      },
      resume: {
        connect: resume,
      },
    },
  });
};
