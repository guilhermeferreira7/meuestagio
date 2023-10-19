import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import bcryptService from '../../../src/utils/bcriptUtils';
import { Role } from '../../../src/modules/auth/roles/roles';
import { TestModule } from '../../test.module';
import { createAdmin } from '../../helpers/create-users';

describe('Admin Auth', () => {
  let app: INestApplication;
  const authRoute = '/auth/login/admin';
  const admin = {
    name: 'Admin',
    email: 'admin@example.com',
    password: bcryptService.hashSync('123123'),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    await createAdmin(admin, module);
    app = module.createNestApplication();
    await app.init();
  });

  it(`should post to ${authRoute} and return a JWT`, async () => {
    const authReq = await request(app.getHttpServer())
      .post(authRoute)
      .send({
        email: 'admin@example.com',
        password: '123123',
      })
      .expect(201);

    expect(authReq.body).toEqual({
      user: {
        sub: expect.any(Number),
        name: admin.name,
        email: admin.email,
        role: Role.ADMIN,
      },
      access_token: expect.any(String),
    });
  });

  it('should not login if the email/password is invalid', async () => {
    // Invalid email
    await request(app.getHttpServer())
      .post(authRoute)
      .send({
        email: 'admin@email.com',
        password: '123123',
      })
      .expect(401);

    // Invalid password
    await request(app.getHttpServer())
      .post(authRoute)
      .send({
        email: admin.email,
        password: 'asdasd',
      })
      .expect(401);
  });
});
