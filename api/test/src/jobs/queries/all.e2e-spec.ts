import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../../src/app.module';
import { createJobWith } from '../../../../prisma/factories/job';
import { createArea } from '../../../../prisma/factories/area';
import { createCompany } from '../../../../prisma/factories/company';
import { prisma } from '../../../../prisma/prisma';

describe('[E2E] Jobs query', () => {
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

  describe('[GET] /jobs with full text search', () => {
    it('should return jobs where title matches', async () => {
      await createJobWith({ title: 'test abc' });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].title).toEqual('test abc');
    });

    it('should return jobs where description matches', async () => {
      await createJobWith({
        description: 'test abc',
      });

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({
          search: 'abc',
        })
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].description).toEqual('test abc');
    });

    it('should return jobs where keywords matches', async () => {
      await createJobWith({
        keywords: 'key1, key2, abc',
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: 'abc',
      });

      expect(body.length).toEqual(1);
      expect(body[0].keywords).toEqual('key1, key2, abc');
    });

    it('should return jobs where company name matches', async () => {
      const company = await createCompany();
      await createJobWith({
        company: { connect: company },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: company.name,
      });

      expect(body.length).toEqual(1);
      expect(body[0].company.name).toEqual(company.name);
    });

    it('should return jobs where area title matches', async () => {
      const area = await createArea();

      await createJobWith({
        area: { connect: area },
      });

      const { body } = await request(app.getHttpServer()).get(endpoint).query({
        search: area.title,
      });

      expect(body.length).toEqual(1);
      expect(body[0].area.title).toEqual(area.title);
    });
  });
});
