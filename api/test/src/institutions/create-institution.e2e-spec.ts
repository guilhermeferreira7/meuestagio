import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { CreateInstitutionDto } from '../../../src/modules/institutions/dtos/create-institution.dto';
import { adminLogin, studentLogin } from '../../helpers/login';
import { createCity } from '../../../prisma/testing/factories/city';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Institution', () => {
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

  describe('[POST] /institutions', () => {
    describe('When user is admin', () => {
      describe('When dto is valid', () => {
        it('should create a new institution', async () => {
          const token = await adminLogin(app);
          const city = await createCity();
          const data: CreateInstitutionDto = {
            name: 'Institution',
            cityId: city.id,
          };

          const { body } = await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(201);

          expect(body).toEqual({
            id: expect.any(Number),
            name: data.name,
            cityId: data.cityId,
          });
        });

        it('should return 400 if cityId is invalid', async () => {
          const token = await adminLogin(app);
          const data: CreateInstitutionDto = {
            name: 'Institution',
            cityId: 999,
          };

          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(400);
        });

        it('should return Conflict if institution already exists', async () => {
          const token = await adminLogin(app);
          const city = await createCity();
          const data: CreateInstitutionDto = {
            name: 'Institution',
            cityId: city.id,
          };

          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(201);

          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(409);
        });
      });

      describe('When dto is invalid', () => {
        it('should return errors', async () => {
          const token = await adminLogin(app);
          await request(app.getHttpServer())
            .post(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect({
              statusCode: 400,
              message: [
                'O nome da instituição é obrigatório',
                'cityId must be a number conforming to the specified constraints',
                'A cidade é obrigatória',
              ],
              error: 'Bad Request',
            });
        });
      });
    });

    describe('When user is not admin', () => {
      it('should return 401 if token is invalid', async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer invalid_token`)
          .expect(401);
      });

      it('should return 403 if user is not admin', async () => {
        const token = await studentLogin(app);
        await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });
});
