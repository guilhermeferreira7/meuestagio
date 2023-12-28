import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { companyLogin, studentLogin } from '../../helpers/login';
import { createJob } from '../../../prisma/testing/factories/job';
import { createJobApplications } from '../../../prisma/testing/factories/job-applications';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Job Applications', () => {
  let app: INestApplication;
  let get: any;
  const getByJobIdPath = '/job-applications/job';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    get = request(app.getHttpServer()).get;
  });

  afterEach(async () => {
    await prisma.jobApplication.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`[GET] ${getByJobIdPath}`, () => {
    describe('When user is a company', () => {
      it('should return 200', async () => {
        const companyToken = await companyLogin(app);
        await get(getByJobIdPath)
          .set('Authorization', `Bearer ${companyToken}`)
          .query({ jobId: 1 })
          .expect(200);
      });

      it('should return job applications if jobId is valid', async () => {
        const job = await createJob();
        const jobApplications = await createJobApplications(2, job.id);
        const token = await companyLogin(app);

        const response = await get(getByJobIdPath)
          .set('Authorization', `Bearer ${token}`)
          .query({ jobId: job.id });

        expect(response.body.length).toBe(2);
        expect(response.body[0].jobId).toBe(job.id);
        expect(response.body[1].jobId).toBe(job.id);

        expect(response.body[0].id).toBe(jobApplications[0].id);
        expect(response.body[0].studentId).toBe(jobApplications[0].studentId);
        expect(response.body[0].resumeId).toBe(jobApplications[0].resumeId);
        expect(response.body[0].message).toBe(jobApplications[0].message);
        expect(response.body[0].jobId).toBe(jobApplications[0].jobId);
      });

      it('should not return job applications from another job', async () => {
        const job = await createJob();
        const anotherJob = await createJob();
        await createJobApplications(2, job.id);
        await createJobApplications(2, anotherJob.id);
        const companyToken = await companyLogin(app);

        const { body } = await get(getByJobIdPath)
          .set('Authorization', `Bearer ${companyToken}`)
          .query({ jobId: job.id });

        expect(body.length).toBe(2);
        expect(body[0].jobId).toBe(job.id);
        expect(body[1].jobId).toBe(job.id);
      });
    });

    describe('When user is not a company', () => {
      it('should return 401 if token is invalid', async () => {
        await get(getByJobIdPath)
          .set('Authorization', `Bearer invalid_token`)
          .expect(401);
      });
      it('should return 403', async () => {
        const studentToken = await studentLogin(app);

        await get(getByJobIdPath)
          .set('Authorization', `Bearer ${studentToken}`)
          .expect(403);
      });
    });
  });
});
