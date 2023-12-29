import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../../src/app.module';
import { professorLogin, studentLogin } from '../../../helpers/login';

describe('[E2E] [GET] Professor /professors/profile', () => {
  let app: INestApplication;
  const endpoint = '/professors/profile';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When token is invalid', () => {
    it('should return 401', async () => {
      await request(app.getHttpServer())
        .get(endpoint)
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });

  describe('When token is valid', () => {
    describe('When user is not a professor', () => {
      it('should return 403', async () => {
        const token = await studentLogin(app);
        await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('When user is a professor', () => {
      it('should return the professor data', async () => {
        const token = await professorLogin(app);

        const { body } = await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.courseId).toBeDefined();
        expect(body.course.id).toBeDefined();
        expect(body.course.name).toBeDefined();
        expect(body.course.institution.name).toBeDefined();
      });
    });
  });
});
