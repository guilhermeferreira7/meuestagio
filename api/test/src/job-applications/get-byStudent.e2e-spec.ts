import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Job, Student } from '@prisma/client';

import { AppModule } from '../../../src/app.module';
import { CreateJobApplicationDto } from '../../../src/modules/job-applications/dtos/update';
import { companyLogin, studentLogin } from '../../helpers/login';
import { get, post } from '../../helpers/request';
import { createJob } from '../../../prisma/testing/factories/job';
import { createStudent } from '../../../prisma/testing/factories/student';
import { prisma } from '../../../prisma/prisma';

describe('[E2E] Job Applications', () => {
  let app: INestApplication;
  const postPath = '/job-applications/apply';
  const getByStudentIdPath = '/job-applications/student';

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

  describe(`[GET] ${getByStudentIdPath}`, () => {
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

      await post(postPath, app, studentToken, jobApplicationDto).expect(201);
    });

    describe('When user is a student', () => {
      it('should return 200', async () => {
        await get(getByStudentIdPath, app, studentToken).expect(200);
      });

      it('should return a list of job applications', async () => {
        const req = await get(getByStudentIdPath, app, studentToken).expect(
          200,
        );

        expect(req.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              studentId: student.id,
              resumeId: student.resumeId,
              jobId: job.id,
              message: jobApplicationDto.message,
            }),
          ]),
        );
      });
      it('should not return job applications from other students', async () => {
        const otherStudent = await createStudent();
        const otherStudentToken = await studentLogin(app, otherStudent.email);
        const jobApplicationDto: CreateJobApplicationDto = {
          studentId: otherStudent.id,
          resumeId: otherStudent.resumeId,
          jobId: job.id,
          message: 'Olá, gostaria de me candidatar a essa vaga 2',
        };
        await post(postPath, app, otherStudentToken, jobApplicationDto).expect(
          201,
        );

        const req = await get(getByStudentIdPath, app, studentToken).expect(
          200,
        );

        expect(req.body).toEqual(
          expect.not.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              studentId: otherStudent.id,
              resumeId: otherStudent.resumeId,
              jobId: job.id,
              message: jobApplicationDto.message,
            }),
          ]),
        );
      });
    });

    describe('When user is not a student', () => {
      it('should return 401 if token is invalid', async () => {
        await get(getByStudentIdPath, app, 'invalid-token').expect(401);
      });
      it('should return 403', async () => {
        const companyToken = await companyLogin(app);

        await get(getByStudentIdPath, app, companyToken).expect(403);
      });
    });
  });
});
