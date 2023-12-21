import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Region } from '@prisma/client';

import { AppModule } from '../../../../src/app.module';
import { createJob, createJobWith } from '../../../../prisma/factories/job';
import { createCompany } from '../../../../prisma/factories/company';
import { createArea } from '../../../../prisma/factories/area';

import { createRegion } from '../../../../prisma/factories/region';
import { prisma } from '../../../../prisma/prisma';

describe('[E2E] Jobs query by region', () => {
  let app: INestApplication;
  let region: Region;

  const endpoint = '/jobs';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    region = await createRegion();
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

  describe('[GET] /jobs by region without full text search', () => {
    it('should return jobs where region matches', async () => {
      await createJobWith({ region: { connect: region } });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          region: region.id,
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].region.name).toEqual(region.name);
    });
  });

  describe('[GET] /jobs by region with full text search', () => {
    it('should return jobs where title matches', async () => {
      await createJobWith({ region: { connect: region }, title: 'test abc' });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
          region: region.id,
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].region.name).toEqual(region.name);
      expect(body[0].title).toEqual('test abc');
    });

    it('should return jobs where description matches', async () => {
      await createJobWith({
        region: { connect: region },
        description: 'test abc',
      });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
          region: region.id,
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].region.name).toEqual(region.name);
      expect(body[0].description).toEqual('test abc');
    });

    it('should return jobs where keywords matches', async () => {
      await createJobWith({
        region: { connect: region },
        keywords: 'key1, key2, abc',
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: 'abc',
        region: region.id,
      });

      expect(body.length).toEqual(1);
      expect(body[0].region.name).toEqual(region.name);
      expect(body[0].keywords).toEqual('key1, key2, abc');
    });

    it('should return jobs where company name matches', async () => {
      const company = await createCompany();
      await createJobWith({
        region: { connect: region },
        company: { connect: company },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: company.name,
        region: region.id,
      });

      expect(body.length).toEqual(1);
      expect(body[0].region.name).toEqual(region.name);
      expect(body[0].company.name).toEqual(company.name);
    });

    it('should return jobs where area title matches', async () => {
      const area = await createArea();

      await createJobWith({
        region: { connect: region },
        area: { connect: area },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: area.title,
        region: region.id,
      });

      expect(body.length).toEqual(1);
      expect(body[0].region.name).toEqual(region.name);
      expect(body[0].area.title).toEqual(area.title);
    });
  });
});
