import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { get } from '../../helpers/request';
import { createManyRegions } from '../../../prisma/factories/region';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] cities/regions get', () => {
  let app: INestApplication;
  const path = '/cities/regions';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await prisma.region.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET] /cities/regions', () => {
    it('should return all regions', async () => {
      const regions = await createManyRegions(5);

      const { body } = await get(path, app).expect(200);
      expect(body.length).toBe(5);

      regions.forEach((region) => {
        expect(body).toContainEqual(region);
      });
    });
  });

  describe('[GET] /cities/regions with page and limit', () => {
    it('should return all regions with page', async () => {
      await createManyRegions(5);
      const { body: all } = await get(path, app).expect(200);
      expect(all.length).toBe(5);

      const { body } = await get(path, app, '', {
        page: 2,
      }).expect(200);

      expect(body.length).toBe(3);
    });

    it('should return all regions with limit', async () => {
      await createManyRegions(5);
      const { body: all } = await get(path, app).expect(200);
      expect(all.length).toBe(5);

      const { body } = await get(path, app, '', {
        limit: 2,
      }).expect(200);

      expect(body.length).toBe(2);
    });
  });

  describe('[GET] /cities/regions with state', () => {
    it('should return all regions with state', async () => {
      const regions = await createManyRegions(5);
      const state = regions[0].state;

      const { body } = await get(path, app, '', {
        state,
      }).expect(200);

      expect(body.length).toBe(1);
      expect(body).toContainEqual(regions[0]);
    });
  });
});
