import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { post } from '../../../helpers/request';
import { CreateLanguageDto } from '../../../../src/modules/resumes/languages/create.dto';
import { createStudent } from '../../../../prisma/testing/factories/student';
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

  describe(`[POST] ${path}`, () => {
    describe('When user is a student', () => {
      it('should return a 400 error if body is invalid', async () => {
        const token = await studentLogin(app);
        await post(path, app, token, {}).expect({
          statusCode: 400,
          message: [
            'name should not be empty',
            'level must be one of the following values: Basico, Intermediario, Avancado, Fluente',
            'level should not be empty',
          ],
          error: 'Bad Request',
        });
      });

      it('should return a 201 status code and the created language', async () => {
        const token = await studentLogin(app);

        const body: CreateLanguageDto = {
          level: 'Basico',
          name: 'Inglês',
        };

        const response = await post(path, app, token, body).expect(201);

        expect(response.body.name).toEqual(body.name);
        expect(response.body.level).toEqual(body.level);
      });

      it('should not create if already exists', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        await createLanguage(student.resumeId, 'Inglês');

        const body: CreateLanguageDto = {
          level: 'Basico',
          name: 'Inglês',
        };

        await post(path, app, token, body).expect(409);
      });
    });

    describe('When user is not a student', () => {
      it('should return a 403 error', async () => {
        const token = await companyLogin(app);
        await post(path, app, token).expect(403);
      });

      it('should return a 401 error if token is invalid', async () => {
        await post(path, app, 'invalid-token').expect(401);
      });
    });
  });
});
