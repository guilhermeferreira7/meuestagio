import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { CreateCityDto } from '../../../src/modules/cities/dtos/create-city.dto';
import { adminLogin, studentLogin } from '../../helpers/login';
import { post } from '../../helpers/request';
import { createRegion } from '../../../prisma/factories/region';
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

  afterEach(async () => {
    await prisma.region.deleteMany();
    await prisma.city.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[POST] /cities', () => {
    describe('When role is admin', () => {
      describe('When data is valid', () => {
        describe('If region exists', () => {
          it('should create and return a city', async () => {
            const token = await adminLogin(app);
            const region = await createRegion();

            const dto: CreateCityDto = {
              name: 'Test City',
              regionId: region.id,
              state: 'Paraná',
              IBGECityCode: 123,
            };

            const { body } = await post(path, app, token, dto).expect(201);

            expect(body.name).toBe(dto.name);
            expect(body.state).toBe(dto.state);
            expect(body.IBGECityCode).toBe(dto.IBGECityCode);
            expect(body.regionId).toBe(dto.regionId);
          });
        });

        describe('If region does not exist', () => {
          it('should return an error', async () => {
            const token = await adminLogin(app);
            const dto: CreateCityDto = {
              name: 'Test City',
              regionId: 1,
              state: 'Paraná',
              IBGECityCode: 123,
            };

            await post(path, app, token, dto).expect({
              statusCode: 400,
              message: 'Região não existe!',
              error: 'Bad Request',
            });
          });
        });
      });

      describe('When data is invalid', () => {
        it('should return an error', async () => {
          const token = await adminLogin(app);
          await post(path, app, token).expect({
            statusCode: 400,
            message: [
              'name should not be empty',
              'state should not be empty',
              'regionId must be a number conforming to the specified constraints',
              'regionId should not be empty',
              'IBGECityCode must be a number conforming to the specified constraints',
              'IBGECityCode should not be empty',
            ],
            error: 'Bad Request',
          });
        });
      });
    });

    describe('When role is not admin', () => {
      it('should return 401 if token is invalid', async () => {
        await post(path, app, 'invalid_token').expect(401);
      });

      it('should return 403 if user is not admin', async () => {
        const token = await studentLogin(app);
        await post(path, app, token).expect(403);
      });
    });
  });
});
