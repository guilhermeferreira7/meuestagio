import { createCity } from './city';
import { createInstitution } from './institution';
import { createCourse } from './course';
import bcryptService from '../../../src/utils/bcriptUtils';
import { faker } from '@faker-js/faker/locale/af_ZA';
import { createResume } from './resume';
import { prisma } from '../../prisma';

export const createStudent = async () => {
  const city = await createCity();
  const institution = await createInstitution();
  const course = await createCourse();

  const student = await prisma.student.create({
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
    },
  });

  const resume = await createResume(student.id);
  return await prisma.student.update({
    where: { id: student.id },
    data: {
      resumeId: resume.id,
    },
  });
};

export const createManyStudents = async (length: number) => {
  const students = [];
  for (let i = 0; i < length; i++) {
    students.push(createStudent());
  }

  return await Promise.all(students);
};
