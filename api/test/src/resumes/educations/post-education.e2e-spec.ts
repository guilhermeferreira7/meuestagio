import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { CreateEducationDto } from '../../../../src/modules/resumes/educations/create.dto';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { post } from '../../../helpers/request';
import { createStudent } from '../../../../prisma/testing/factories/student';
import { createEducation } from '../../../../prisma/testing/factories/education';

describe('[E2E] Education', () => {
  let app: INestApplication;
  const path = '/resumes/me/educations';

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

  describe(`[POST] ${path}`, () => {
    describe('When user is a student', () => {
      it('should return a 400 error if body is invalid', async () => {
        const studentToken = await studentLogin(app);
        await post(path, app, studentToken, {}).expect({
          statusCode: 400,
          message: [
            'school must be a string',
            'degree must be one of the following values: EnsinoMedio, EnsinoTecnico, EnsinoSuperior, PosGraduacao',
            'fieldOfStudy must be a string',
            'startDate must be a Date instance',
            'startDate should not be empty',
            'endDate must be a Date instance',
            'endDate should not be empty',
          ],
          error: 'Bad Request',
        });
      });

      it('should return a 201 status code and the created education', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const body: CreateEducationDto = {
          degree: 'EnsinoMedio',
          fieldOfStudy: 'fieldOfStudy',
          school: 'school',
          startDate: new Date(),
          endDate: new Date(),
        };

        const response = await post(path, app, studentToken, body).expect(201);

        expect(response.body.degree).toBe(body.degree);
        expect(response.body.fieldOfStudy).toBe(body.fieldOfStudy);
        expect(response.body.school).toBe(body.school);
        expect(response.body.startDate).toBe(body.startDate.toISOString());
        expect(response.body.endDate).toBe(body.endDate.toISOString());
      });

      it('should not create if already exists', async () => {
        const student = await createStudent();
        await createEducation(student.resumeId, 'school');

        const studentToken = await studentLogin(app, student.email);

        const body: CreateEducationDto = {
          degree: 'EnsinoMedio',
          fieldOfStudy: 'fieldOfStudy',
          school: 'school',
          startDate: new Date(),
          endDate: new Date(),
        };

        await post(path, app, studentToken, body).expect(409);
      });
    });

    describe('When user is not a student', () => {
      it('should return a 403 error', async () => {
        const companyToken = await companyLogin(app);
        const createEducationDto: CreateEducationDto = {
          degree: 'EnsinoMedio',
          fieldOfStudy: 'fieldOfStudy',
          school: 'school',
          endDate: new Date(),
          startDate: new Date(),
        };

        await post(path, app, companyToken, createEducationDto).expect(403);
      });

      it('should return a 401 error if token is invalid', async () => {
        const createEducationDto: CreateEducationDto = {
          degree: 'EnsinoMedio',
          fieldOfStudy: 'fieldOfStudy',
          school: 'school',
          endDate: new Date(),
          startDate: new Date(),
        };

        await post(path, app, 'invalid-token', createEducationDto).expect(401);
      });
    });
  });
});
