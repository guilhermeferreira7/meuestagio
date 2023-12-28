import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../../src/app.module';
import {
  createJob,
  createJobWith,
} from '../../../../prisma/testing/factories/job';
import { createCompany } from '../../../../prisma/testing/factories/company';
import { createArea } from '../../../../prisma/testing/factories/area';
import { prisma } from '../../../../prisma/prisma';

describe('[E2E] Jobs query by region', () => {
  let app: INestApplication;
  const state = 'Test State';

  const endpoint = '/jobs';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  beforeEach(async () => {
    await createJob();
    const { body } = await request(app.getHttpServer())
      .get(endpoint)
      .expect(200);
    expect(body.length).toBe(1);
  });

  afterEach(async () => {
    await prisma.job.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET] /jobs with full text search and region', () => {
    it('should return jobs where title matches', async () => {
      await createJobWith({ state, title: 'test abc' });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
          state,
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].state).toEqual(state);
      expect(body[0].title).toEqual('test abc');
    });

    it('should return jobs where description matches', async () => {
      await createJobWith({
        state,
        description: 'test abc',
      });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
          state,
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].state).toEqual(state);
      expect(body[0].description).toEqual('test abc');
    });

    it('should return jobs where keywords matches', async () => {
      await createJobWith({
        state,
        keywords: 'key1, key2, abc',
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: 'abc',
        state,
      });

      expect(body.length).toEqual(1);
      expect(body[0].state).toEqual(state);
      expect(body[0].keywords).toEqual('key1, key2, abc');
    });

    it('should return jobs where company name matches', async () => {
      const company = await createCompany();
      await createJobWith({
        state,
        company: { connect: company },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: company.name,
        state,
      });

      expect(body.length).toEqual(1);
      expect(body[0].state).toEqual(state);
      expect(body[0].company.name).toEqual(company.name);
    });

    it('should return jobs where area title matches', async () => {
      const area = await createArea();

      await createJobWith({
        state,
        area: { connect: area },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        state,
        search: area.title,
      });

      expect(body.length).toEqual(1);
      expect(body[0].state).toEqual(state);
      expect(body[0].area.title).toEqual(area.title);
    });
  });
});
