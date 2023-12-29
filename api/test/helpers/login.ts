import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createStudent } from '../../prisma/testing/factories/student';
import { createCompany } from '../../prisma/testing/factories/company';
import { createUser } from '../../prisma/testing/factories/user';
import { createProfessor } from '../../prisma/testing/factories/professor';

export async function companyLogin(
  app: INestApplication,
  email?: string,
): Promise<string> {
  const companyEmail = email || (await createCompany()).email;

  const req = await request(app.getHttpServer())
    .post('/auth/login/company')
    .send({
      email: companyEmail,
      password: '123123',
    });

  return req.body.access_token;
}

export async function studentLogin(
  app: INestApplication,
  email?: string,
): Promise<string> {
  const studentEmail = email || (await createStudent()).email;

  const req = await request(app.getHttpServer())
    .post('/auth/login/student')
    .send({
      email: studentEmail,
      password: '123123',
    });

  return req.body.access_token;
}

export async function adminLogin(
  app: INestApplication,
  email?: string,
): Promise<string> {
  const adminEmail = email || (await createUser()).email;

  const req = await request(app.getHttpServer())
    .post('/auth/login/admin')
    .send({
      email: adminEmail,
      password: '123123',
    });

  return req.body.access_token;
}

export async function professorLogin(
  app: INestApplication,
  email?: string,
): Promise<string> {
  const professorEmail = email || (await createProfessor()).email;

  const req = await request(app.getHttpServer())
    .post('/auth/login/professor')
    .send({
      email: professorEmail,
      password: '123123',
    });

  return req.body.access_token;
}
