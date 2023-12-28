import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { createStudent } from '../../../../prisma/testing/factories/student';
import { del, get } from '../../../helpers/request';
import { createSkill } from '../../../../prisma/testing/factories/skill';

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

  describe(`[GET] ${path}/:id`, () => {
    describe('When user is a student', () => {
      it('should return a 204 status code', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        const skill = await createSkill(student.resumeId);

        await del(`${path}/${skill.id}`, app, token).expect(204);
      });

      it('should delete the skill', async () => {
        const student = await createStudent();
        const studentToken = await studentLogin(app, student.email);
        const skill = await createSkill(student.resumeId);

        const before = await get(path, app, studentToken).expect(200);
        expect(before.body).toEqual([
          {
            id: skill.id,
            resumeId: skill.resumeId,
            name: skill.name,
            level: skill.level,
          },
        ]);

        await del(`${path}/${skill.id}`, app, studentToken);
        const after = await get(path, app, studentToken).expect(200);

        expect(after.body).toEqual([]);
      });

      it('should return a 404 error if skill does not exist', async () => {
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
