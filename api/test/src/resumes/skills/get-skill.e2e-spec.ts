import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { companyLogin, studentLogin } from '../../../helpers/login';
import { createStudent } from '../../../../prisma/factories/student';
import { get } from '../../../helpers/request';
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

  describe(`[GET] ${path}`, () => {
    describe('When user is a student', () => {
      it('should return a list of skills', async () => {
        const student = await createStudent();
        const token = await studentLogin(app, student.email);
        const skill = await createSkill(student.resumeId);

        const response = await get(path, app, token).expect(200);

        expect(response.body).toEqual([
          {
            id: skill.id,
            resumeId: skill.resumeId,
            name: skill.name,
            level: skill.level,
          },
        ]);
      });

      it('should not return skills from another student', async () => {
        const student = await createStudent();
        await createSkill(student.resumeId);

        const studentTwo = await createStudent();
        const skillTwo = await createSkill(studentTwo.resumeId);

        const token = await studentLogin(app, student.email);
        const response = await get(path, app, token).expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body).not.toEqual([
          {
            id: skillTwo.id,
            resumeId: skillTwo.resumeId,
            name: skillTwo.name,
            level: skillTwo.level,
          },
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
