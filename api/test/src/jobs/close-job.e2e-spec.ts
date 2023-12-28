import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { JobApplicationStatusEnum, JobStatusEnum } from '@prisma/client';

import { AppModule } from '../../../src/app.module';
import { companyLogin, studentLogin } from '../../helpers/login';
import { createCompany } from '../../../prisma/testing/factories/company';
import { createJob } from '../../../prisma/testing/factories/job';
import { createJobApplications } from '../../../prisma/testing/factories/job-applications';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] [PATCH] /jobs/:id/close', () => {
  let app: INestApplication;
  let token: string;

  const endpoint = (id: number) => `/jobs/${id}/close`;

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

  describe('When user is a company', () => {
    it('should close a job', async () => {
      const company = await createCompany();
      const job = await createJob(company.id);

      await request(app.getHttpServer())
        .patch(endpoint(job.id))
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const { body } = await request(app.getHttpServer())
        .get(`/jobs/${job.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.status).toBe(JobStatusEnum.closed);
    });

    it('should close all job applications', async () => {
      const company = await createCompany();
      const job = await createJob(company.id);
      await createJobApplications(2, job.id);

      await request(app.getHttpServer())
        .patch(endpoint(job.id))
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const { body } = await request(app.getHttpServer())
        .get('/job-applications/job')
        .query({ jobId: job.id })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: JobApplicationStatusEnum.Finalizado,
          }),
        ]),
      );
    });
  });
  describe('When user is not a company', () => {
    it('should return 401 if token is invalid', async () => {
      await request(app.getHttpServer())
        .patch(endpoint(1))
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });

    it('should return 403 if user is not a company', async () => {
      const invalidToken = await studentLogin(app);

      await request(app.getHttpServer())
        .patch(endpoint(1))
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(403);
    });
  });
});
