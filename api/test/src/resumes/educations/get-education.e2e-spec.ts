import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { clearDatabase } from '../../../helpers/database-setup';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { get } from '../../../helpers/request';
import { createStudent } from '../../../../prisma/factories/student';
import { createEducation } from '../../../../prisma/factories/education';

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

  afterEach(async () => {
    await clearDatabase();
  });

  describe(`[GET] ${path}`, () => {
    describe('When user is a student', () => {
      it('should return a list of educations', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const education = await createEducation(student.resumeId);

        const response = await get(path, app, studentToken).expect(200);
        expect(response.body).toEqual([
          {
            ...education,
            startDate: education.startDate.toISOString(),
            endDate: education.endDate.toISOString(),
          },
        ]);
      });

      it('should not return educations from another student', async () => {
        const student = await createStudent();
        await createEducation(student.resumeId);

        const studentTwo = await createStudent();
        const educationTwo = await createEducation(studentTwo.resumeId);

        const studentToken = await studentLogin(app, student.email);
        const response = await get(path, app, studentToken).expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body).not.toEqual([
          expect.objectContaining({
            id: educationTwo.id,
          }),
        ]);
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
