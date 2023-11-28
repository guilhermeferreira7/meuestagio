import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { clearDatabase } from '../../../helpers/database-setup';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { post } from '../../../helpers/request';
import { createStudent } from '../../../../prisma/factories/student';
import { CreateSkillDto } from '../../../../src/modules/resumes/skills/create.dto';
import { createSkill } from '../../../../prisma/factories/skill';

describe('[E2E] Skill', () => {
  let app: INestApplication;
  const path = '/resumes/me/skills';

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
        const token = await studentLogin(app);
        await post(path, app, token, {}).expect({
          statusCode: 400,
          message: [
            'name should not be empty',
            'level must be one of the following values: Basico, Intermediario, Avancado',
            'level should not be empty',
          ],
          error: 'Bad Request',
        });
      });

      it('should return a 201 status code and the created skill', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);

        const body: CreateSkillDto = {
          level: 'Basico',
          name: 'React',
        };

        const response = await post(path, app, token, body).expect(201);

        expect(response.body.name).toEqual(body.name);
        expect(response.body.level).toEqual(body.level);
      });

      it('should not create if already exists', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        await createSkill(student.resumeId, 'React');

        const body: CreateSkillDto = {
          level: 'Basico',
          name: 'React',
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
