import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { companyLogin, studentLogin } from '../../helpers/login';
import { get } from '../../helpers/request';
import {
  createManyStudents,
  createStudent,
} from '../../../prisma/factories/student';

describe('[E2E] Resume', () => {
  let app: INestApplication;
  const path = '/resumes/me';

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

  describe(`[GET] ${path}`, () => {
    describe('When user is a student', () => {
      it('should return the resume with all the fields', async () => {
        await createManyStudents(10);
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);

        const response = await get(path, app, studentToken).expect(200);

        expect(response.body.id).toEqual(student.resumeId);
        expect(response.body.educations).toBeDefined();
        expect(response.body.experiences).toBeDefined();
        expect(response.body.languages).toBeDefined();
        expect(response.body.skills).toBeDefined();
      });
    });

    describe('When user is not a student', () => {
      it('should return a 403 error', async () => {
        const companyToken = await companyLogin(app);

        await get(path, app, companyToken).expect(403);
      });

      it('should return a 401 error if token is invalid', async () => {
        await get(path, app, 'invalid-token').expect(401);
      });
    });
  });
});
