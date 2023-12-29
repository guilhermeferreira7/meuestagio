import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../../src/app.module';
import {
  adminLogin,
  professorLogin,
  studentLogin,
} from '../../../helpers/login';
import { CreateProfessorDto } from '../../../../src/modules/users/professors/professor-create.dto';
import { createCourse } from '../../../../prisma/testing/factories/course';
import { faker } from '@faker-js/faker';
import bcryptService from '../../../../src/utils/bcriptUtils';

describe('[E2E] [POST] Professor /professors', () => {
  let app: INestApplication;
  const endpoint = '/professors';

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
        .post(endpoint)
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });

  describe('When token is valid', () => {
    describe('When user is not admin', () => {
      it('should return 403', async () => {
        const token = await studentLogin(app);
        await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('When user is admin', () => {
      describe('When dto is invalid', () => {
        it('should return 400', async () => {
          const token = await adminLogin(app);
          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        });

        it('should return all errors', async () => {
          const token = await adminLogin(app);
          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect({
              statusCode: 400,
              message: [
                'name should not be empty',
                'email should not be empty',
                'password should not be empty',
                'courseId must be a number conforming to the specified constraints',
                'courseId should not be empty',
              ],
              error: 'Bad Request',
            });
        });
      });

      describe('When dto is valid', () => {
        it('should create professor', async () => {
          const token = await adminLogin(app);
          const course = await createCourse();
          const dto: CreateProfessorDto = {
            courseId: course.id,
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: bcryptService.hashSync('123123'),
          };

          const { body } = await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send(dto)
            .expect(201);

          expect(body.id).toBeDefined();
          expect(body.name).toBe(dto.name);
          expect(body.email).toBe(dto.email);
          expect(body.courseId).toBe(dto.courseId);
          expect(body.password).toBeUndefined();
        });

        it('should return 409 if email is already in use', async () => {
          const token = await adminLogin(app);
          const course = await createCourse();
          const dto: CreateProfessorDto = {
            courseId: course.id,
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: bcryptService.hashSync('123123'),
          };

          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send(dto)
            .expect(201);

          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send(dto)
            .expect(409);
        });
      });
    });
  });
});
