import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { clearDatabase } from '../../helpers/database-setup';
import { companyLogin, studentLogin } from '../../helpers/login';
import { get } from '../../helpers/request';
import { createJob } from '../../../prisma/factories/job';
import { createJobApplications } from '../../../prisma/factories/job-applications';
import { createCompany } from '../../../prisma/factories/company';

describe('[E2E] Job Applications', () => {
  let app: INestApplication;
  const getByJobIdPath = '/job-applications/job';

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
    await clearDatabase();
  });

  describe(`[GET] ${getByJobIdPath}`, () => {
    beforeEach(async () => {});

    describe('When user is a company', () => {
      it('should return 200', async () => {
        const companyToken = await companyLogin(app);
        await get(getByJobIdPath, app, companyToken, {
          jobId: 1,
        }).expect(200);
      });

      it('should return job applications if jobId is valid', async () => {
        const job = await createJob();
        const jobApplications = await createJobApplications(2, job.id);
        const companyToken = await companyLogin(app);

        const response = await get(getByJobIdPath, app, companyToken, {
          jobId: job.id,
        });

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
        const company = await createCompany();
        const companyToken = await companyLogin(app, company.email);
        const job = await createJob(company.id);
        const anotherJob = await createJob();

        await createJobApplications(2, job.id);
        await createJobApplications(2, anotherJob.id);

        const response = await get(getByJobIdPath, app, companyToken, {
          jobId: job.id,
        });

        expect(response.body.length).toBe(2);
        expect(response.body).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              jobId: anotherJob.id,
            }),
          ]),
        );
      });
    });

    describe('When user is not a company', () => {
      it('should return 401 if token is invalid', async () => {
        await get(getByJobIdPath, app, 'invalid-token').expect(401);
      });
      it('should return 403', async () => {
        const studentToken = await studentLogin(app);

        await get(getByJobIdPath, app, studentToken).expect(403);
      });
    });
  });
});
