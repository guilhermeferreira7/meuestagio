import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { CreateJobDto } from '../../../src/modules/jobs/dtos/create-job.dto';
import { companyLogin, studentLogin } from '../../helpers/login';
import { createCompany } from '../../../prisma/testing/factories/company';
import { createArea } from '../../../prisma/testing/factories/area';
import { createRegion } from '../../../prisma/testing/factories/region';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] [POST] /jobs', () => {
  let app: INestApplication;
  let token: string;

  const endpoint = '/jobs';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    token = await companyLogin(app);
  });

  afterEach(async () => {
    await prisma.job.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When user is company', () => {
    it('should create a job if params are valid', async () => {
      const company = await createCompany();
      const area = await createArea();
      const region = await createRegion();

      const jobDto: CreateJobDto = {
        title: 'Job Title',
        areaId: area.id,
        cityId: company.cityId,
        companyId: company.id,
        regionId: region.id,
        description: 'Job description',
        keywords: 'keyword1, keyword2',
        state: 'Paraná',
        remote: false,
        salary: '1000',
      };

      await request(app.getHttpServer())
        .post(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .send(jobDto)
        .expect(201);
    });

    it('should return 400 if params are invalid', async () => {
      await request(app.getHttpServer())
        .post(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect({
          statusCode: 400,
          message: [
            'title should not be empty',
            'description should not be empty',
            'cityId must be a number conforming to the specified constraints',
            'cityId should not be empty',
            'regionId must be a number conforming to the specified constraints',
            'regionId should not be empty',
            'state should not be empty',
            'remote should not be empty',
            'companyId must be a number conforming to the specified constraints',
            'companyId should not be empty',
            'keywords should not be empty',
            'areaId must be a number conforming to the specified constraints',
            'areaId should not be empty',
          ],
          error: 'Bad Request',
        });
    });
  });

  describe('When user is not a company', () => {
    it('should return 401 if token is invalid', async () => {
      await request(app.getHttpServer())
        .post(endpoint)
        .set('Authorization', `Bearer invalid_token`);
      expect(401);
    });

    it('should return 403 if user is not a company', async () => {
      const invalidToken = await studentLogin(app);

      await request(app.getHttpServer())
        .post(endpoint)
        .set('Authorization', `Bearer ${invalidToken}`);
      expect(403);
    });
  });
});
