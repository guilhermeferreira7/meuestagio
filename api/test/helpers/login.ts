import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createCompany, createStudent } from './database-setup';

export async function companyLogin(app: INestApplication): Promise<string> {
  const company = { email: 'company@email.com', pass: '123123' };
  await createCompany(company.email, company.pass);

  const req = await request(app.getHttpServer())
    .post('/auth/login/company')
    .send({
      email: company.email,
      password: '123123',
    });

  return req.body.access_token;
}

export async function studentLogin(app: INestApplication): Promise<string> {
  const student = { email: 'student@email.com', pass: '123123' };
  await createStudent(student.email, student.pass);

  const req = await request(app.getHttpServer())
    .post('/auth/login/student')
    .send({
      email: student.email,
      password: '123123',
    });

  return req.body.access_token;
}
