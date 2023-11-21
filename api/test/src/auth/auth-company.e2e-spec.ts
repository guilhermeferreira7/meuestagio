import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { Role } from '../../../src/modules/auth/roles/roles';
import { createCompany } from '../../helpers/database-setup';

describe('[E2E] Company Auth', () => {
  let app: INestApplication;
  let authRoute = '/auth/login/company';
  const company = {
    email: 'company@email.com',
    pass: '123123',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await createCompany(company.email, company.pass);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`[POST] ${authRoute}`, () => {
    it('should return a JWT if email/password is correct', async () => {
      const req = await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: company.email,
          password: company.pass,
        })
        .expect(201);

      expect(req.body).toEqual({
        user: {
          sub: expect.any(Number),
          name: expect.any(String),
          email: company.email,
          role: Role.COMPANY,
        },
        access_token: expect.any(String),
      });
    });

    it('should not login if the email/password is invalid', async () => {
      await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: 'company@wrong.com',
          password: '123123',
        })
        .expect(401);

      await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: company.email,
          password: 'asdasd',
        })
        .expect(401);
    });
  });
});
