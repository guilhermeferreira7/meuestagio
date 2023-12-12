import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import {
  createCourse,
  createManyCourses,
} from '../../../prisma/factories/course';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] [GET] /courses', () => {
  let app: INestApplication;
  const endpoint = '/courses';

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

  afterEach(async () => {
    await prisma.course.deleteMany();
  });

  describe('[GET] /courses', () => {
    it('should return all courses', async () => {
      await createManyCourses(5);
      const course = await createCourse();

      const { body } = await request(app.getHttpServer()).get(endpoint);

      expect(body.length).toBe(6);

      expect(body[0].id).toBe(course.id);
      expect(body[0].name).toBe(course.name);
      expect(body[0].institutionId).toBe(course.institutionId);
      expect(body[0].areaId).toBe(course.areaId);
      expect(body[0].area.title).toBe(course.area.title);
    });
  });

  describe('[GET] /courses with page and limit', () => {
    it('should return all courses with page', async () => {
      await createManyCourses(5);

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ page: 2 });

      expect(body.length).toBe(3);
    });
    it('should return all courses with limit', async () => {
      await createManyCourses(5);

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ limit: 2 });

      expect(body.length).toBe(2);
    });
  });

  describe('[GET] /courses with institutionId', () => {
    it('should return all courses with institutionId', async () => {
      const course = await createCourse();
      await createManyCourses(5);

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ institutionId: course.institutionId });

      expect(body.length).toBe(1);
      expect(body[0].id).toBe(course.id);
      expect(body[0].name).toBe(course.name);
      expect(body[0].institutionId).toBe(course.institutionId);
    });
  });

  describe('[GET] /courses with areaId', () => {
    it('should return all courses with areaId', async () => {
      const course = await createCourse();
      await createManyCourses(5);

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ areaId: course.areaId });

      expect(body.length).toBe(1);
      expect(body[0].id).toBe(course.id);
      expect(body[0].name).toBe(course.name);
      expect(body[0].areaId).toBe(course.areaId);
    });
  });

  describe('[GET] /courses with name', () => {
    it('should return all courses with name', async () => {
      const course = await createCourse('Curso Teste');
      await createManyCourses(5);

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ name: 'Teste' });

      expect(body.length).toBe(1);
      expect(body[0].id).toBe(course.id);
      expect(body[0].name).toBe(course.name);
    });
  });

  describe('[GET] /courses with orderBy', () => {
    it('should return all courses ordered by name', async () => {
      await createCourse('Curso B');
      await createCourse('Curso A');
      await createCourse('Curso C');

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ orderBy: 'name' });

      expect(body[0].name).toBe('Curso A');
      expect(body[1].name).toBe('Curso B');
      expect(body[2].name).toBe('Curso C');
    });

    it('should return all courses ordered by id', async () => {
      await createCourse('Curso 1');
      await createCourse('Curso 2');
      await createCourse('Curso 3');

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ orderBy: 'id' });

      expect(body[0].name).toBe('Curso 1');
      expect(body[1].name).toBe('Curso 2');
      expect(body[2].name).toBe('Curso 3');

      const { body: bodyNotOrdered } = await request(app.getHttpServer()).get(
        endpoint,
      );

      expect(bodyNotOrdered[0].name).toBe('Curso 3');
      expect(bodyNotOrdered[1].name).toBe('Curso 2');
      expect(bodyNotOrdered[2].name).toBe('Curso 1');
    });
  });
});
