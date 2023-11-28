import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { CreateExperienceDto } from '../../../../src/modules/resumes/experiences/create.dto';
import { clearDatabase } from '../../../helpers/database-setup';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { post } from '../../../helpers/request';
import { createStudent } from '../../../../prisma/factories/student';
import { createExperience } from '../../../../prisma/factories/experience';

describe('[E2E] Experience', () => {
  let app: INestApplication;
  const path = '/resumes/me/experiences';

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

  describe(`[POST] ${path}`, () => {
    describe('When user is a student', () => {
      it('should return a 400 error if body is invalid', async () => {
        const studentToken = await studentLogin(app);
        await post(path, app, studentToken, {}).expect({
          statusCode: 400,
          message: [
            'company should not be empty',
            'position should not be empty',
            'description should not be empty',
            'currentJob must be a boolean value',
            'startDate must be a Date instance',
            'startDate should not be empty',
            'endDate must be a Date instance',
            'endDate should not be empty',
          ],
          error: 'Bad Request',
        });
      });

      it('should return a 201 status code and the created experience', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const body: CreateExperienceDto = {
          company: 'company',
          position: 'position',
          description: 'description',
          currentJob: false,
          startDate: new Date(),
          endDate: new Date(),
        };

        const response = await post(path, app, studentToken, body).expect(201);

        expect(response.body.company).toBe(body.company);
        expect(response.body.position).toBe(body.position);
        expect(response.body.description).toBe(body.description);
        expect(response.body.currentJob).toBe(body.currentJob);
        expect(response.body.startDate).toBe(body.startDate.toISOString());
        expect(response.body.endDate).toBe(body.endDate.toISOString());
      });

      it('should not create if already exists', async () => {
        const student = await createStudent();
        await createExperience(student.resumeId, 'company');

        const studentToken = await studentLogin(app, student.email);

        const body: CreateExperienceDto = {
          company: 'company',
          currentJob: false,
          description: 'description',
          position: 'position',
          startDate: new Date(),
          endDate: new Date(),
        };

        await post(path, app, studentToken, body).expect(409);
      });
    });

    describe('When user is not a student', () => {
      it('should return a 403 error', async () => {
        const companyToken = await companyLogin(app);
        const body: CreateExperienceDto = {
          company: 'company',
          currentJob: false,
          description: 'description',
          position: 'position',
          startDate: new Date(),
          endDate: new Date(),
        };

        await post(path, app, companyToken, body).expect(403);
      });

      it('should return a 401 error if token is invalid', async () => {
        const body: CreateExperienceDto = {
          company: 'company',
          currentJob: false,
          description: 'description',
          position: 'position',
          startDate: new Date(),
          endDate: new Date(),
        };

        await post(path, app, 'invalid-token', body).expect(401);
      });
    });
  });
});
