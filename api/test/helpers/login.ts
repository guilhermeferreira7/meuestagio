import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import bcryptService from '../../src/utils/bcriptUtils';
import { createCompany } from './create-users';

export async function companyLogin(
  module: TestingModule,
  app: INestApplication,
): Promise<string> {
  const company = {
    name: 'Company Test',
    email: 'company@email.com',
    password: bcryptService.hashSync('123123'),
  };
  await createCompany(company, module);

  const req = await request(app.getHttpServer())
    .post('/auth/login/company')
    .send({
      email: company.email,
      password: '123123',
    });

  return req.body.access_token;
}
