import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Role } from '../../../src/modules/auth/roles/roles';
import { AppModule } from '../../../src/app.module';
import { createUser } from '../../../prisma/factories/user';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Admin Auth', () => {
  let app: INestApplication;
  const authRoute = '/auth/login/admin';

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
    await prisma.user.deleteMany();
  });

  describe(`[POST] ${authRoute}`, () => {
    it('should return a JWT if email/password is correct', async () => {
      const admin = await createUser();

      const authReq = await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: admin.email,
          password: '123123',
        })
        .expect(201);

      expect(authReq.body).toEqual({
        user: {
          sub: expect.any(Number),
          name: expect.any(String),
          email: admin.email,
          role: Role.ADMIN,
        },
        access_token: expect.any(String),
      });
    });

    it('should not login if the email/password is invalid', async () => {
      const admin = await createUser();

      await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: 'admin@wrong.com',
          password: '123123',
        })
        .expect(401);

      await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: admin.email,
          password: 'asdasd',
        })
        .expect(401);
    });
  });
});
