import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createStudent } from '../../prisma/factories/student';
import { createCompany } from '../../prisma/factories/company';

export async function companyLogin(
  app: INestApplication,
  email?: string,
): Promise<string> {
  const company = await createCompany();

  const req = await request(app.getHttpServer())
    .post('/auth/login/company')
    .send({
      email: email || company.email,
      password: '123123',
    });

  return req.body.access_token;
}

export async function studentLogin(app: INestApplication): Promise<string> {
  const student = await createStudent();

  const req = await request(app.getHttpServer())
    .post('/auth/login/student')
    .send({
      email: student.email,
      password: '123123',
    });

  return req.body.access_token;
}
