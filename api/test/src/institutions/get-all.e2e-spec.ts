import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import {
  createInstitution,
  createManyInstitutions,
} from '../../../prisma/factories/institution';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Institutions', () => {
  let app: INestApplication;
  const endpoint = '/institutions';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await prisma.institution.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET] /institutions ', () => {
    it('should return institutions with right data', async () => {
      const { id, name, cityId, city } = await createInstitution();
      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .expect(200);

      expect(body).toHaveLength(1);

      expect(body[0].id).toEqual(id);
      expect(body[0].name).toEqual(name);
      expect(body[0].cityId).toEqual(cityId);
      expect(body[0].city.name).toEqual(city.name);
      expect(body[0].city.state).toEqual(city.state);
      expect(body[0].city.regionId).toEqual(city.regionId);
      expect(body[0].city.IBGECityCode).toEqual(city.IBGECityCode);

      await createManyInstitutions(5);

      await request(app.getHttpServer())
        .get(endpoint)
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(6);
        });
    });
  });

  describe('[GET] /institutions with page and limit', () => {
    it('should return all institutions with page', async () => {
      await createManyInstitutions(5);

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ page: 2 })
        .expect(200);
      expect(body).toHaveLength(3);
    });

    it('should return all institutions with limit', async () => {
      await createManyInstitutions(5);
      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ limit: 2 })
        .expect(200);
      expect(body).toHaveLength(2);
    });
  });

  describe('[GET] /institutions with orderBy', () => {
    it('should return all ordered by name', async () => {
      await createInstitution('C');
      await createInstitution('A');
      await createInstitution('B');

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ orderBy: 'name' })
        .expect(200);

      expect(body).toHaveLength(3);
      expect(body[0].name).toBe('A');
      expect(body[1].name).toBe('B');
      expect(body[2].name).toBe('C');
    });

    it('should return all ordered by id', async () => {
      const institutionOne = await createInstitution();
      const institutionTwo = await createInstitution();
      const institutionThree = await createInstitution();

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ orderBy: 'id' })
        .expect(200);

      expect(body).toHaveLength(3);
      expect(body[0].id).toBe(institutionOne.id);
      expect(body[1].id).toBe(institutionTwo.id);
      expect(body[2].id).toBe(institutionThree.id);

      const { body: bodyNoOrder } = await request(app.getHttpServer())
        .get(endpoint)
        .expect(200);

      expect(bodyNoOrder).toHaveLength(3);
      expect(bodyNoOrder[0].id).toBe(institutionThree.id);
    });
  });

  describe('[GET] /institutions with name', () => {
    it('should return all institutions with name', async () => {
      await createInstitution('Institution One');
      await createInstitution('Institution Two');
      await createInstitution('Institution Three');

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ name: 'One' })
        .expect(200);

      expect(body).toHaveLength(1);
      expect(body[0].name).toBe('Institution One');
    });
  });

  describe('[GET] /institutions with cityId', () => {
    it('should return all institutions with cityId', async () => {
      const institutionOne = await createInstitution();
      await createInstitution();
      await createInstitution();

      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query({ cityId: institutionOne.cityId })
        .expect(200);

      expect(body).toHaveLength(1);
      expect(body[0].id).toBe(institutionOne.id);
    });
  });
});
