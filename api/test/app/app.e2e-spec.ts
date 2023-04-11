import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });
  describe('Create Student', () => {
    it('should create user then return it', async () => {
      const createUserReq = await request(app.getHttpServer())
        .post('/users/create')
        .send({
          email: 'newUser@example.com',
          name: 'guilherme',
          password: '123123',
        })
        .expect(201);
      expect(createUserReq.body.email).toEqual('newUser@example.com');
      return createUserReq;
    });
  });

  it('should get a JWT then successfully make a call', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;
    const response = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(response.body.userId).toBeDefined();
    expect(response.body.email).toEqual('john@example.com');

    return response;
  });

  afterAll(async () => {
    await app.close();
  });
});
