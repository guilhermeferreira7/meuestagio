import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JobApplicationStatusEnum } from '@prisma/client';

import { AppModule } from '../../../src/app.module';
import { patch, post } from '../../helpers/request';
import { adminLogin, companyLogin, studentLogin } from '../../helpers/login';
import { createJobApplications } from '../../../prisma/factories/job-applications';
import { createCompany } from '../../../prisma/factories/company';
import { createJob } from '../../../prisma/factories/job';
import { createStudent } from '../../../prisma/factories/student';
import { CreateJobApplicationDto } from '../../../src/modules/job-applications/dtos/update';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Job Applications', () => {
  let app: INestApplication;
  const interviewPath = '/job-applications/interview';
  const finishPath = '/job-applications/finish';
  const postPath = '/job-applications/apply';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await prisma.jobApplication.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`PATCH ${interviewPath}`, () => {
    describe('when user is a company', () => {
      it('should set status to interview', async () => {
        const company = await createCompany();
        const job = await createJob(company.id);
        const jobApplication = await createJobApplications(1, job.id);

        const token = await companyLogin(app, company.email);
        const response = await patch(interviewPath, app, token, {
          jobApplicationId: jobApplication[0].id,
        }).expect(200);

        expect(response.body.status).toBe(JobApplicationStatusEnum.Entrevista);
      });
    });

    describe('when user is not a company', () => {
      it('should return 403', async () => {
        const token = await studentLogin(app);
        await patch(interviewPath, app, token).expect(403);
      });

      it('should return 401 if user is not authenticated', async () => {
        await patch(interviewPath, app).expect(401);
      });
    });
  });

  describe(`PATCH ${finishPath}`, () => {
    describe('when user is a student', () => {
      it('should set status to finished', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        const job = await createJob();

        const jobApplicationDto: CreateJobApplicationDto = {
          jobId: job.id,
          resumeId: student.resumeId,
          studentId: student.id,
        };
        const postResponse = await post(
          postPath,
          app,
          token,
          jobApplicationDto,
        ).expect(201);

        const response = await patch(finishPath, app, token, {
          jobApplicationId: postResponse.body.id,
        }).expect(200);

        expect(response.body.status).toBe(JobApplicationStatusEnum.Finalizado);
      });
    });

    describe('when user is a company', () => {
      it('should set status to finished', async () => {
        const company = await createCompany();
        const job = await createJob(company.id);
        const jobApplication = await createJobApplications(1, job.id);

        const token = await companyLogin(app, company.email);
        const response = await patch(finishPath, app, token, {
          jobApplicationId: jobApplication[0].id,
        }).expect(200);

        expect(response.body.status).toBe(JobApplicationStatusEnum.Finalizado);
      });
    });

    describe('when user is not a company or student', () => {
      it('should return 403', async () => {
        const token = await adminLogin(app);
        await patch(finishPath, app, token).expect(403);
      });

      it('should return 401 if user is not authenticated', async () => {
        await patch(finishPath, app).expect(401);
      });
    });
  });
});
