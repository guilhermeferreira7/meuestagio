import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { get } from '../../../helpers/request';
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

  describe(`[GET] ${path}`, () => {
    describe('When user is a student', () => {
      it('should return a list of experiences', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const experience = await createExperience(student.resumeId);

        const response = await get(path, app, studentToken).expect(200);
        expect(response.body).toEqual([
          {
            id: experience.id,
            company: experience.company,
            position: experience.position,
            description: experience.description,
            startDate: experience.startDate.toISOString(),
            endDate: experience.endDate.toISOString(),
            currentJob: experience.currentJob,
            resumeId: experience.resumeId,
          },
        ]);
      });

      it('should not return experiences from another student', async () => {
        const student = await createStudent();
        await createExperience(student.resumeId);

        const studentTwo = await createStudent();
        const experienceTwo = await createExperience(studentTwo.resumeId);

        const studentToken = await studentLogin(app, student.email);
        const response = await get(path, app, studentToken).expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body).not.toEqual([
          expect.objectContaining({
            id: experienceTwo.id,
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
        await get(path, app, 'invalidToken').expect(401);
      });
    });
  });
});
