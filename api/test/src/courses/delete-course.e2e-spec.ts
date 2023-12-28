import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { adminLogin, studentLogin } from '../../helpers/login';
import {
  createCourse,
  createManyCourses,
} from '../../../prisma/testing/factories/course';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] [DELETE] /courses', () => {
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

  afterEach(async () => {
    await prisma.course.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When user is admin', () => {
    it('should return 404 if course does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`${endpoint}/1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should delete course', async () => {
      await createManyCourses(5);
      const course = await createCourse();

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.length).toBe(6);

      const { body: deletedCourse } = await request(app.getHttpServer())
        .delete(`${endpoint}/${course.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(deletedCourse.id).toBe(course.id);

      const { body: courses } = await request(app.getHttpServer())
        .get(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(courses.length).toBe(5);
    });
  });

  describe('When user is not admin', () => {
    it('should return 403', async () => {
      const token = await studentLogin(app);
      await request(app.getHttpServer())
        .delete(`${endpoint}/1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 401 if token is invalid', async () => {
      await request(app.getHttpServer())
        .delete(`${endpoint}/1`)
        .set('Authorization', `Bearer invalid_token`)
        .expect(401);
    });
  });
});
