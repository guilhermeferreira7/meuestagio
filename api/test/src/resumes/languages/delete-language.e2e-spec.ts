import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { clearDatabase } from '../../../helpers/database-setup';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { del, get } from '../../../helpers/request';
import { createStudent } from '../../../../prisma/factories/student';
import { createLanguage } from '../../../../prisma/factories/language';

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

  afterEach(async () => {
    await clearDatabase();
  });

  describe(`[GET] ${path}/:id`, () => {
    describe('When user is a student', () => {
      it('should return a 204 status code', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        const language = await createLanguage(student.resumeId);

        await del(`${path}/${language.id}`, app, token).expect(204);
      });

      it('should delete the language', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const language = await createLanguage(student.resumeId);

        const before = await get(path, app, studentToken).expect(200);
        await del(`${path}/${language.id}`, app, studentToken);
        const after = await get(path, app, studentToken).expect(200);

        expect(before.body).toEqual([
          {
            id: language.id,
            resumeId: language.resumeId,
            name: language.name,
            level: language.level,
          },
        ]);
        expect(after.body).toEqual([]);
      });

      it('should return a 404 error if language does not exist', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        await del(`${path}/1`, app, token).expect(404);
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
