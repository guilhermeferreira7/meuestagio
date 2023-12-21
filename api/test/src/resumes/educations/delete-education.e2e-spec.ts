import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { CreateEducationDto } from '../../../../src/modules/resumes/educations/create.dto';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { del, get } from '../../../helpers/request';
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

  describe(`[GET] ${path}/:id`, () => {
    describe('When user is a student', () => {
      it('should return a 204 status code', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const education = await createEducation(student.resumeId);

        await del(`${path}/${education.id}`, app, studentToken).expect(204);
      });

      it('should delete the education', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const education = await createEducation(student.resumeId);

        const getResponseBefore = await get(path, app, studentToken).expect(
          200,
        );

        await del(`${path}/${education.id}`, app, studentToken);
        const getResponseAfter = await get(path, app, studentToken).expect(200);

        expect(getResponseBefore.body).toEqual([
          {
            ...education,
            startDate: education.startDate.toISOString(),
            endDate: education.endDate.toISOString(),
          },
        ]);
        expect(getResponseAfter.body).toEqual([]);
      });

      it('should return a 404 error if education does not exist', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);

        await del(`${path}/1`, app, studentToken).expect(404);
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

        await del(`${path}/1`, app, companyToken, createEducationDto).expect(
          403,
        );
      });

      it('should return a 401 error if token is invalid', async () => {
        const createEducationDto: CreateEducationDto = {
          degree: 'EnsinoMedio',
          fieldOfStudy: 'fieldOfStudy',
          school: 'school',
          endDate: new Date(),
          startDate: new Date(),
        };

        await del(`${path}/1`, app, 'invalid-token', createEducationDto).expect(
          401,
        );
      });
    });
  });
});
