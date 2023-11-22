import { faker } from '@faker-js/faker';

import { prisma } from '../../prisma/prisma';
import { CompanyCreateInput } from '../../src/types/prisma/company';
import { StudentCreateInput } from '../../src/types/prisma/student';
import bcryptService from '../../src/utils/bcriptUtils';

export const createCity = async () => {
  const region = await prisma.region.create({
    data: {
      IBGECode: faker.number.int({ max: 1000 }),
      name: faker.internet.userName(),
      state: faker.location.state(),
    },
  });

  const city = await prisma.city.create({
    data: {
      IBGECityCode: faker.number.int({ max: 1000 }),
      name: faker.internet.userName(),
      state: faker.location.state(),
      region: { connect: region },
    },
  });

  return city;
};

export const createStudent = async (email: string, pass: string) => {
  const city = await createCity();
  const institution = await prisma.institution.upsert({
    create: { name: 'UTFPR', city: { connect: city } },
    update: {},
    where: { name: 'UTFPR' },
  });

  const area = await prisma.area.upsert({
    create: {
      cnpqId: 1,
      title: 'Ciência da Computação',
    },
    update: {},
    where: { cnpqId: 1 },
  });

  const course = await prisma.course.create({
    data: {
      name: faker.word.noun(),
      institution: { connect: institution },
      area: { connect: area },
    },
  });

  const studentData: StudentCreateInput = {
    name: 'Student Test',
    email,
    password: bcryptService.hashSync(pass),
    city: {
      connect: city,
    },
    course: {
      connect: course,
    },
    institution: {
      connect: institution,
    },
  };

  const student = await prisma.student.upsert({
    where: { email: studentData.email },
    create: studentData,
    update: {},
  });

  return student;
};

export const createAdmin = async (email: string, pass: string) => {
  const adminData = {
    name: 'Admin Test',
    email,
    password: bcryptService.hashSync(pass),
  };

  const admin = await prisma.user.upsert({
    where: { email: adminData.email },
    create: adminData,
    update: {},
  });

  return admin;
};

export const createCompany = async (email: string, pass: string) => {
  const city = await createCity();

  const companyData: CompanyCreateInput = {
    name: 'Company Test',
    email,
    password: bcryptService.hashSync(pass),
    cnpj: faker.number.int({ min: 100000, max: 999999 }).toString(),
    city: {
      connect: city,
    },
  };

  const company = await prisma.company.upsert({
    where: { email: companyData.email },
    create: companyData,
    update: {},
  });

  return company;
};
