import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { createStudent } from '../../../../prisma/testing/factories/student';
import { get } from '../../../helpers/request';
import { createLanguage } from '../../../../prisma/testing/factories/language';

describe('[E2E] Language', () => {
  let app: INestApplication;
  const path = '/resumes/me/languages';

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
      it('should return a list of languages', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        const language = await createLanguage(student.resumeId);

        const response = await get(path, app, token).expect(200);
        expect(response.body).toEqual([
          {
            id: language.id,
            name: language.name,
            level: language.level,
            resumeId: language.resumeId,
          },
        ]);
      });

      it('should not return languages from another student', async () => {
        const student = await createStudent();
        await createLanguage(student.resumeId);

        const studentTwo = await createStudent();
        const languageTwo = await createLanguage(studentTwo.resumeId);

        const token = await studentLogin(app, student.email);
        const response = await get(path, app, token).expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body).not.toEqual([
          expect.objectContaining({
            id: languageTwo.id,
          }),
        ]);
      });
    });

    describe('When user is not a student', () => {
      it('should return a 403 error', async () => {
        const token = await companyLogin(app);
        await get(path, app, token).expect(403);
      });

      it('should return a 401 error if token is invalid', async () => {
        await get(path, app, 'invalidToken').expect(401);
      });
    });
  });
});
