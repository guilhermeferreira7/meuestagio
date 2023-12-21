import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { createJob, createManyJobs } from '../../../prisma/factories/job';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] [GET] all Jobs', () => {
  let app: INestApplication;
  const endpoint = '/jobs';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await prisma.job.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET] /jobs', () => {
    it('should return all jobs', async () => {
      await request(app.getHttpServer())
        .get(endpoint)
        .expect(200)
        .then(({ body }) => expect(body).toHaveLength(0));

      await createManyJobs(4);
      const req = await request(app.getHttpServer()).get(endpoint).expect(200);

      expect(req.body).toHaveLength(4);
      expect(req.body[0].company.name).toEqual(expect.any(String));
      expect(req.body[0].area.title).toEqual(expect.any(String));
    });
    it('should have all data correctly', async () => {
      const job = await createJob();

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .expect(200);

      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(job.id);
      expect(body[0].title).toEqual(job.title);
      expect(body[0].description).toEqual(job.description);
      expect(body[0].keywords).toEqual(job.keywords);
      expect(body[0].remote).toEqual(job.remote);
      expect(body[0].salary).toEqual(job.salary);
      expect(body[0].state).toEqual(job.state);
      expect(body[0].status).toEqual(job.status);
      expect(body[0].area.title).toEqual(job.area.title);
      expect(body[0].city.name).toEqual(job.city.name);
      expect(body[0].company.name).toEqual(job.company.name);
      expect(body[0].region.name).toEqual(job.region.name);
    });
  });

  describe(`[GET] by id ${endpoint}/id`, () => {
    it('should return a job by id with all data', async () => {
      const {
        id,
        title,
        description,
        keywords,
        remote,
        salary,
        state,
        status,
      } = await createJob();

      const req = await request(app.getHttpServer())
        .get(`${endpoint}/${id}`)
        .expect(200);

      expect(req.body).toHaveProperty('id', id);
      expect(req.body).toHaveProperty('title', title);
      expect(req.body).toHaveProperty('description', description);
      expect(req.body).toHaveProperty('keywords', keywords);
      expect(req.body).toHaveProperty('remote', remote);
      expect(req.body).toHaveProperty('salary', salary);
      expect(req.body).toHaveProperty('state', state);
      expect(req.body).toHaveProperty('status', status);
      expect(req.body).toEqual(
        expect.objectContaining({
          area: expect.objectContaining({
            title: expect.any(String),
          }),
          city: expect.objectContaining({
            name: expect.any(String),
          }),
        }),
      );
    });
  });
});
