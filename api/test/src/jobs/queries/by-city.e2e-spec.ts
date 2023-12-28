import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { City } from '@prisma/client';

import { AppModule } from '../../../../src/app.module';
import {
  createJob,
  createJobWith,
} from '../../../../prisma/testing/factories/job';
import { createCity } from '../../../../prisma/testing/factories/city';
import { createCompany } from '../../../../prisma/testing/factories/company';
import { createArea } from '../../../../prisma/testing/factories/area';
import { prisma } from '../../../../prisma/prisma';

describe('[E2E] Jobs query by city', () => {
  let app: INestApplication;
  let city: City;

  const endpoint = '/jobs';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    city = await createCity();
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

  describe('[GET] /jobs with full text search and city', () => {
    it('should return jobs where title matches', async () => {
      await createJobWith({ city: { connect: city }, title: 'test abc' });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
          city: city.id,
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].city.name).toEqual(city.name);
      expect(body[0].title).toEqual('test abc');
    });

    it('should return jobs where description matches', async () => {
      await createJobWith({
        city: { connect: city },
        description: 'test abc',
      });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
          city: city.id,
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].city.name).toEqual(city.name);
      expect(body[0].description).toEqual('test abc');
    });

    it('should return jobs where keywords matches', async () => {
      await createJobWith({
        city: { connect: city },
        keywords: 'key1, key2, abc',
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: 'abc',
        city: city.id,
      });

      expect(body.length).toEqual(1);
      expect(body[0].city.name).toEqual(city.name);
      expect(body[0].keywords).toEqual('key1, key2, abc');
    });

    it('should return jobs where company name matches', async () => {
      const company = await createCompany();
      await createJobWith({
        city: { connect: city },
        company: { connect: company },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: company.name,
        city: city.id,
      });

      expect(body.length).toEqual(1);
      expect(body[0].city.name).toEqual(city.name);
      expect(body[0].company.name).toEqual(company.name);
    });

    it('should return jobs where area title matches', async () => {
      const area = await createArea();

      await createJobWith({
        city: { connect: city },
        area: { connect: area },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: area.title,
        city: city.id,
      });

      expect(body.length).toEqual(1);
      expect(body[0].city.name).toEqual(city.name);
      expect(body[0].area.title).toEqual(area.title);
    });
  });
});
