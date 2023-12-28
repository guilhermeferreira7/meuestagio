import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { CreateCourseDto } from '../../../src/modules/courses/dtos/create-course.dto';
import { adminLogin, studentLogin } from '../../helpers/login';
import { createCourse } from '../../../prisma/testing/factories/course';
import { createArea } from '../../../prisma/testing/factories/area';
import { createInstitution } from '../../../prisma/testing/factories/institution';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] [POST] /courses', () => {
  let app: INestApplication;
  let token: string;
  const endpoint = '/courses';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    token = await adminLogin(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When user is admin', () => {
    describe('when dto is valid', () => {
      it('should return error if course already exists in the institution', async () => {
        const course = await createCourse();
        const area = await createArea();

        const dto: CreateCourseDto = {
          areaId: area.id,
          institutionId: course.institutionId,
          name: course.name,
        };
        await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .send(dto)
          .expect(409);
      });

      it('should create course', async () => {
        const area = await createArea();
        const institution = await createInstitution();

        const dto: CreateCourseDto = {
          areaId: area.id,
          institutionId: institution.id,
          name: 'Curso de teste',
        };

        const { body } = await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .send(dto)
          .expect(201);

        expect(body.id).toBeDefined();
        expect(body.name).toEqual(dto.name);
        expect(body.areaId).toEqual(dto.areaId);
        expect(body.institutionId).toEqual(dto.institutionId);
      });
    });

    describe('when dto is invalid', () => {
      it('should return 400', async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .expect({
            statusCode: 400,
            message: [
              'name should not be empty',
              'institutionId must be a number conforming to the specified constraints',
              'institutionId should not be empty',
              'areaId must be a number conforming to the specified constraints',
              'areaId should not be empty',
            ],
            error: 'Bad Request',
          });
      });
    });
  });

  describe('When user is not admin', () => {
    it('should return 403', async () => {
      const token = await studentLogin(app);
      await request(app.getHttpServer())
        .post(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 401 if token is invalid', async () => {
      await request(app.getHttpServer())
        .post(endpoint)
        .set('Authorization', `Bearer invalid_token`)
        .expect(401);
    });
  });
});
