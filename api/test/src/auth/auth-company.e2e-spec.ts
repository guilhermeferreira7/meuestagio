import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { Role } from '../../../src/modules/auth/roles/roles';
import { createCompany } from '../../../prisma/factories/company';
import { clearDatabase } from '../../helpers/database-setup';

describe('[E2E] Company Auth', () => {
  let app: INestApplication;
  let authRoute = '/auth/login/company';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe(`[POST] ${authRoute}`, () => {
    it('should return a JWT if email/password is correct', async () => {
      const company = await createCompany();
      const req = await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: company.email,
          password: '123123',
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
      const company = await createCompany();
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
