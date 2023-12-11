import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { get } from '../../helpers/request';
import { createCity, createManyCities } from '../../../prisma/factories/city';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Cities', () => {
  let app: INestApplication;
  const path = '/cities';

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
    await prisma.city.deleteMany();
  });

  describe('[GET] /cities', () => {
    it('should return all cities', async () => {
      const cities = await createManyCities(5);

      const { body } = await get(path, app).expect(200);

      expect(body.length).toBe(5);
      cities.forEach((city) => {
        expect(body).toContainEqual(city);
      });
    });
  });

  describe('[GET] /cities with page and limit', () => {
    it('should return all cities with page', async () => {
      await createManyCities(5);
      const { body: all } = await get(path, app).expect(200);
      expect(all.length).toBe(5);

      const { body } = await get(path, app, '', {
        page: 2,
      }).expect(200);

      expect(body.length).toBe(3);
    });

    it('should return all cities with limit', async () => {
      await createManyCities(5);
      const { body: all } = await get(path, app).expect(200);
      expect(all.length).toBe(5);

      const { body } = await get(path, app, '', {
        limit: 2,
      }).expect(200);
      expect(body.length).toBe(2);
    });
  });

  describe('[GET] /cities with orderBy', () => {
    it('should return all cities ordered by name', async () => {
      await createCity({ name: 'A' });
      await createCity({ name: 'B' });
      await createCity({ name: 'C' });

      const { body: bodyNoOrderBy } = await get(path, app).expect(200);
      expect(bodyNoOrderBy.length).toBe(3);
      expect(bodyNoOrderBy[0].name).toBe('C');

      const { body: bodyOrderBy } = await get(path, app, '', {
        orderBy: 'name',
      }).expect(200);

      expect(bodyOrderBy.length).toBe(3);
      expect(bodyOrderBy[0].name).toBe('A');
    });

    it('should return all cities ordered by id', async () => {
      const cityOne = await createCity();
      const cityTwo = await createCity();

      const { body: bodyNoOrderBy } = await get(path, app).expect(200);
      expect(bodyNoOrderBy.length).toBe(2);
      expect(bodyNoOrderBy[0].name).toBe(cityTwo.name);

      const { body: bodyOrderBy } = await get(path, app, '', {
        orderBy: 'id',
      }).expect(200);
      expect(bodyOrderBy.length).toBe(2);
      expect(bodyOrderBy[0].name).toBe(cityOne.name);
    });
  });

  describe('[GET] /cities with where', () => {
    it('should return all cities with name', async () => {
      await createCity({ name: 'A' });
      await createCity({ name: 'B' });
      await createCity({ name: 'C' });

      await get(path, app)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(3);
        });

      const { body } = await get(path, app, '', {
        name: 'A',
      }).expect(200);

      expect(body.length).toBe(1);
      expect(body[0].name).toBe('A');
    });

    it('should return all cities with state', async () => {
      await createCity({ state: 'A' });
      await createCity({ state: 'B' });
      await createCity({ state: 'C' });

      await get(path, app)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(3);
        });

      const { body } = await get(path, app, '', {
        state: 'A',
      }).expect(200);

      expect(body.length).toBe(1);
      expect(body[0].state).toBe('A');
    });

    it('should return all cities with region', async () => {
      const cityOne = await createCity();
      await createManyCities(2);

      await get(path, app)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(3);
        });

      const { body } = await get(path, app, '', {
        region: cityOne.regionId,
      }).expect(200);

      expect(body.length).toBe(1);
      expect(body[0].regionId).toBe(cityOne.regionId);
    });
  });
});
