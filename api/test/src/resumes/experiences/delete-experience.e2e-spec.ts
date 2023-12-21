import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { del, get } from '../../../helpers/request';
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

  describe(`[GET] ${path}/:id`, () => {
    describe('When user is a student', () => {
      it('should return a 204 status code', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        const experience = await createExperience(student.resumeId);

        await del(`${path}/${experience.id}`, app, token).expect(204);
      });

      it('should delete the experience', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const experience = await createExperience(student.resumeId);

        const getResponseBefore = await get(path, app, studentToken).expect(
          200,
        );

        await del(`${path}/${experience.id}`, app, studentToken);
        const getResponseAfter = await get(path, app, studentToken).expect(200);

        expect(getResponseBefore.body).toEqual([
          {
            ...experience,
            startDate: experience.startDate.toISOString(),
            endDate: experience.endDate.toISOString(),
          },
        ]);
        expect(getResponseAfter.body).toEqual([]);
      });

      it('should return a 404 error if experience does not exist', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);

        await del(`${path}/1`, app, studentToken).expect(404);
      });
    });

    describe('When user is not a student', () => {
      it('should return a 403 error', async () => {
        const token = await companyLogin(app);

        await del(`${path}/1`, app, token).expect(403);
      });

      it('should return a 401 error if token is invalid', async () => {
        await del(`${path}/1`, app, 'invalidToken').expect(401);
      });
    });
  });
});
