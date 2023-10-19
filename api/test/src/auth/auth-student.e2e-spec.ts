import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { TestModule } from '../../test.module';
import bcryptService from '../../../src/utils/bcriptUtils';
import { createStudent } from '../../helpers/create-users';

describe('StudentAuth', () => {
  let app: INestApplication;
  let authRoute = '/auth/login/student';

  const student = {
    name: 'Student Test',
    email: 'student@email.com',
    password: bcryptService.hashSync('123123'),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    await createStudent(student, module);
    app = module.createNestApplication();
    await app.init();
  });

  it(`should post to ${authRoute} and return a JWT`, async () => {
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
        name: student.name,
        email: student.email,
        role: 'student',
      },
      access_token: expect.any(String),
    });
  });
});
