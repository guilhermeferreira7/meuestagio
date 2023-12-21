import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { Role } from '../../../src/modules/auth/roles/roles';
import { createStudent } from '../../../prisma/factories/student';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Student Auth', () => {
  let app: INestApplication;
  const authRoute = '/auth/login/student';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prisma.student.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`[POST] ${authRoute}`, () => {
    it('should return JWT if email/password is correct', async () => {
      const student = await createStudent();

      const req = await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: student.email,
          password: '123123',
        })
        .expect(201);

      expect(req.body).toEqual({
        user: {
          sub: expect.any(Number),
          name: expect.any(String),
          email: student.email,
          role: Role.STUDENT,
        },
        access_token: expect.any(String),
      });
    });

    it('should not login if the email/password is invalid', async () => {
      const student = await createStudent();

      await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: 'student@wrong.com',
          password: '123123',
        })
        .expect(401);

      await request(app.getHttpServer())
        .post(authRoute)
        .send({
          email: student.email,
          password: 'asdasd',
        })
        .expect(401);
    });
  });
});
