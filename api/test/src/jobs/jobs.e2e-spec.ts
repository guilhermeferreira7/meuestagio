import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JobApplicationStatusEnum, JobStatusEnum } from '@prisma/client';

import { AppModule } from '../../../src/app.module';
import { CreateJobDto } from '../../../src/modules/jobs/dtos/create-job.dto';
import { createCompany } from '../../../prisma/factories/company';
import { createArea } from '../../../prisma/factories/area';
import { createRegion } from '../../../prisma/factories/region';
import { createJob, createManyJobs } from '../../../prisma/factories/job';
import { companyLogin, studentLogin } from '../../helpers/login';
import { get, patch, post } from '../../helpers/request';
import { clearDatabase } from '../../helpers/database-setup';
import { createJobApplications } from '../../../prisma/factories/job-applications';

describe('[E2E] Jobs', () => {
  let app: INestApplication;
  const postPath = '/jobs';
  const patchPath = '/jobs/:id/close';
  const getByCompanyIdPath = '/jobs/company';
  const getAllPath = '/jobs';
  const getByIdPath = '/jobs/:id';

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

  describe(`[POST] ${postPath}`, () => {
    describe('When token is valid', () => {
      it('should create a job if params are valid', async () => {
        const company = await createCompany();
        const companyToken = await companyLogin(app, company.email);
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

        await post(postPath, app, companyToken, jobDto);
      });

      it('should return 400 if params are invalid', async () => {
        const company = await createCompany();
        const companyToken = await companyLogin(app, company.email);

        await post(postPath, app, companyToken).expect({
          statusCode: 400,
          error: 'Bad Request',
          message: [
            'title should not be empty',
            'description should not be empty',
            'cityId should not be empty',
            'regionId should not be empty',
            'state should not be empty',
            'remote should not be empty',
            'companyId should not be empty',
            'keywords should not be empty',
            'areaId should not be empty',
          ],
        });
      });
    });

    describe('When token is invalid', () => {
      it('should return 401 if token is invalid', async () => {
        const token = 'invalid_token';

        await post(postPath, app, token).expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });

      it('should return 403 if user is not a company', async () => {
        const invalidToken = await studentLogin(app);

        await post(postPath, app, invalidToken).expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        });
      });
    });
  });

  describe(`[PATCH] ${patchPath}`, () => {
    describe('When token is valid', () => {
      it('should close a job', async () => {
        const company = await createCompany();
        const companyToken = await companyLogin(app, company.email);
        const job = await createJob(company.id);

        await patch(`/jobs/${job.id}/close`, app, companyToken).expect(200);

        const updatedJob = await get(`/jobs/${job.id}`, app).expect(200);
        expect(updatedJob.body.status).toBe(JobStatusEnum.closed);
      });

      it('should close all job applications', async () => {
        const company = await createCompany();
        const companyToken = await companyLogin(app, company.email);
        const job = await createJob(company.id);
        await createJobApplications(2, job.id);

        await patch(`/jobs/${job.id}/close`, app, companyToken).expect(200);

        const getJobApplications = await get(
          '/job-applications/job',
          app,
          companyToken,
          {
            jobId: job.id,
          },
        ).expect(200);

        expect(getJobApplications.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              status: JobApplicationStatusEnum.Finalizado,
            }),
          ]),
        );
      });
    });
    describe('When token is invalid', () => {
      it('should return 401 if token is invalid', async () => {
        const invalidToken = 'invalid_token';

        await patch('/jobs/1/close', app, invalidToken).expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });

      it('should return 403 if user is not a company', async () => {
        const invalidToken = await studentLogin(app);

        await patch('/jobs/1/close', app, invalidToken).expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        });
      });
    });
  });

  describe(`[GET] jobs/company/:id`, () => {
    describe('When token is valid', () => {
      it('should return all jobs by company id', async () => {
        const company = await createCompany();
        const companyToken = await companyLogin(app, company.email);
        const jobs = await createJob(company.id);

        const req = await get(
          `${getByCompanyIdPath}/${company.id}`,
          app,
          companyToken,
        ).expect(200);

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

        const req = await get(
          `${getByCompanyIdPath}/${company.id}`,
          app,
          companyToken,
        ).expect(200);
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

        await get(`${getByCompanyIdPath}/${1}`, app, invalidToken).expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });

      it('should return 403 if user is not a company', async () => {
        const invalidToken = await studentLogin(app);

        await get(`${getByCompanyIdPath}/${1}`, app, invalidToken).expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        });
      });
    });
  });

  describe(`[GET] ${getAllPath}`, () => {
    it('should return all jobs', async () => {
      const jobs = await createManyJobs(4);

      const req = await get(`${getAllPath}`, app).expect(200);

      expect(req.body).toEqual(expect.arrayContaining([...jobs]));
      expect(req.body).toHaveLength(4);
    });

    it('should return all jobs by city', async () => {});
  });

  describe(`[GET] ${getByIdPath}`, () => {
    it('should return a job by id with all data', async () => {
      const {
        id,
        title,
        description,
        keywords,
        remote,
        salary,
        state,
        status,
      } = await createJob();

      const req = await get(`/jobs/${id}`, app).expect(200);
      expect(req.body).toHaveProperty('id', id);
      expect(req.body).toHaveProperty('title', title);
      expect(req.body).toHaveProperty('description', description);
      expect(req.body).toHaveProperty('keywords', keywords);
      expect(req.body).toHaveProperty('remote', remote);
      expect(req.body).toHaveProperty('salary', salary);
      expect(req.body).toHaveProperty('state', state);
      expect(req.body).toHaveProperty('status', status);
      expect(req.body).toEqual(
        expect.objectContaining({
          area: expect.objectContaining({
            title: expect.any(String),
          }),
          city: expect.objectContaining({
            name: expect.any(String),
          }),
        }),
      );
    });
  });
});
