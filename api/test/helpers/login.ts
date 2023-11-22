import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createCompany, createStudent } from './database-setup';

export async function companyLogin(
  app: INestApplication,
  email = 'company@email.com',
): Promise<string> {
  await createCompany(email, '123123');

  const req = await request(app.getHttpServer())
    .post('/auth/login/company')
    .send({
      email: email,
      password: '123123',
    });

  return req.body.access_token;
}

export async function studentLogin(
  app: INestApplication,
  email = 'student@email.com',
): Promise<string> {
  await createStudent(email, '123123');

  const req = await request(app.getHttpServer())
    .post('/auth/login/student')
    .send({
      email: email,
      password: '123123',
    });

  return req.body.access_token;
}
