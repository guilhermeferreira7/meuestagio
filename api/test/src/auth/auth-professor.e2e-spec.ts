import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Role } from '../../../src/modules/auth/roles/roles';
import { AppModule } from '../../../src/app.module';
import { createProfessor } from '../../../prisma/testing/factories/professor';

describe('[E2E] Professor Auth /auth/login/professor', () => {
  let app: INestApplication;
  const endpoint = '/auth/login/professor';

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

  it('should return a JWT if email/password is correct', async () => {
    const professor = await createProfessor();

    const { body } = await request(app.getHttpServer())
      .post(endpoint)
      .send({
        email: professor.email,
        password: '123123',
      })
      .expect(201);

    expect(body).toEqual({
      user: {
        sub: expect.any(Number),
        name: expect.any(String),
        email: professor.email,
        role: Role.PROFESSOR,
      },
      access_token: expect.any(String),
    });
  });

  it('should not login if the email/password is invalid', async () => {
    const professor = await createProfessor();

    await request(app.getHttpServer())
      .post(endpoint)
      .send({
        email: professor.email,
        password: 'wrong-password',
      })
      .expect(401);

    await request(app.getHttpServer())
      .post(endpoint)
      .send({
        email: 'wrong-email',
        password: '123123',
      })
      .expect(401);
  });
});
