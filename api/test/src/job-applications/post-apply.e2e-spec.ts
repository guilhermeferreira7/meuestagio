import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Job, Student } from '@prisma/client';

import { AppModule } from '../../../src/app.module';
import { CreateJobApplicationDto } from '../../../src/modules/job-applications/dtos/update';
import { companyLogin, studentLogin } from '../../helpers/login';
import { post } from '../../helpers/request';
import { createJob } from '../../../prisma/factories/job';
import { createStudent } from '../../../prisma/factories/student';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Job Applications', () => {
  let app: INestApplication;
  const path = '/job-applications/apply';

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

  describe(`[POST] ${path}`, () => {
    let student: Student;
    let studentToken: string;
    let job: Job;
    let jobApplicationDto: CreateJobApplicationDto;

    beforeEach(async () => {
      student = await createStudent();
      studentToken = await studentLogin(app, student.email);
      job = await createJob();

      jobApplicationDto = {
        studentId: student.id,
        resumeId: student.resumeId,
        jobId: job.id,
        message: 'Olá, gostaria de me candidatar a essa vaga',
      };
    });

    describe('When user is a student', () => {
      describe('If job application is valid', () => {
        it('should return 201', async () => {
          await post(path, app, studentToken, jobApplicationDto).expect(201);
        });
        it('should create a job-application', async () => {
          const req = await post(
            path,
            app,
            studentToken,
            jobApplicationDto,
          ).expect(201);

          expect(req.body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              studentId: student.id,
              resumeId: student.resumeId,
              jobId: job.id,
              message: jobApplicationDto.message,
            }),
          );
        });
      });
      describe('If job application is invalid', () => {
        it('should return 400 if job id is invalid', async () => {
          await post(path, app, studentToken, {
            ...jobApplicationDto,
            jobId: 999,
          }).expect(400);
        });

        it('should return 400 if student id is invalid', async () => {
          await post(path, app, studentToken, {
            ...jobApplicationDto,
            studentId: 999,
          }).expect(400);
        });

        it('should return 400 if resume id is invalid', async () => {
          await post(path, app, studentToken, {
            ...jobApplicationDto,
            resumeId: 999,
          }).expect(400);
        });
      });
    });

    describe('When user not a student', () => {
      it('should return 401 if token is invalid', async () => {
        await post(path, app, 'invalid-token', jobApplicationDto).expect(401);
      });

      it('should return 403', async () => {
        const companyToken = await companyLogin(app);

        await post(path, app, companyToken, jobApplicationDto).expect(403);
      });
    });
  });
});
