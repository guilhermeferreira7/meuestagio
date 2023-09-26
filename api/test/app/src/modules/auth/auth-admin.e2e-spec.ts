import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../../../src/app.module';

describe('Admin Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });

  it('should post to auth/login/admin and return a JWT', async () => {
    await request(app.getHttpServer())
      .post('/auth/login/admin')
      .send({
        email: 'admin@example.com',
        password: '123123',
      })
      .expect(201);
  });

  it('should not login if the email/password is invalid', async () => {
    await request(app.getHttpServer())
      .post('/auth/login/admin')
      .send({
        email: 'admin@email.com',
        password: '123123',
      })
      .expect(401);
  });
});
