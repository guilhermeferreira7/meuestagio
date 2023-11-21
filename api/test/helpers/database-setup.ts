import { prisma } from '../../prisma/prisma';
import { CompanyCreateInput } from '../../src/types/prisma/company';
import { StudentCreateInput } from '../../src/types/prisma/student';
import bcryptService from '../../src/utils/bcriptUtils';

const createCity = async () => {
  const region = await prisma.region.create({
    data: { IBGECode: 1, name: 'Guarapuava', state: 'Paraná' },
  });
  const city = await prisma.city.create({
    data: {
      IBGECityCode: 1,
      name: 'Guarapuava',
      state: 'Paraná',
      region: { connect: region },
    },
  });

  return city;
};

export const createStudent = async (email: string, pass: string) => {
  const city = await createCity();
  const institution = await prisma.institution.create({
    data: { name: 'UTFPR', city: { connect: city } },
  });

  const area = await prisma.area.create({
    data: {
      cnpqId: 1,
      title: 'Ciência da Computação',
    },
  });

  const course = await prisma.course.create({
    data: {
      name: 'Engenharia de Software',
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
    cnpj: '12312312312312',
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
