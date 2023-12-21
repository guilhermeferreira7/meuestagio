import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { createCompany } from '../../../prisma/factories/company';
import { companyLogin, studentLogin } from '../../helpers/login';
import { createJob } from '../../../prisma/factories/job';
import { prisma } from '../../../prisma/prisma';

describe('[GET] jobs/company/:id', () => {
  let app: INestApplication;
  let token: string;
  const endpoint = (id: number) => `/jobs/company/${id}`;

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

  describe('When token is valid', () => {
    it('should return all jobs by company id', async () => {
      const company = await createCompany();
      const jobs = await createJob(company.id);

      const req = await request(app.getHttpServer())
        .get(endpoint(company.id))
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(req.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...jobs,
          }),
        ]),
      );
    });

    it('should not return jobs from another company', async () => {
      const company = await createCompany();
      const anotherCompany = await createCompany();
      const companyToken = await companyLogin(app, company.email);
      const anotherJobs = await createJob(anotherCompany.id);

      const req = await request(app.getHttpServer())
        .get(endpoint(company.id))
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200);

      expect(req.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...anotherJobs,
          }),
        ]),
      );
    });
  });

  describe('When token is invalid', () => {
    it('should return 401 if token is invalid', async () => {
      const invalidToken = 'invalid_token';

      await request(app.getHttpServer())
        .get(endpoint(1))
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });

    it('should return 403 if user is not a company', async () => {
      const invalidToken = await studentLogin(app);

      await request(app.getHttpServer())
        .get(endpoint(1))
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(403);
    });
  });
});
