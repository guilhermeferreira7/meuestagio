import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { companyLogin, studentLogin } from '../../helpers/login';
import { AppModule } from '../../../src/app.module';
import { CreateContractDto } from '../../../src/modules/contracts/dtos/create.dto';
import { createStudent } from '../../../prisma/testing/factories/student';

describe('[E2E] Contracts', () => {
  let app: INestApplication;
  const path = '/contracts';

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

  describe('[POST] /contracts', () => {
    describe('When role is company', () => {
      it('should create when dto is valid', async () => {
        const token = await companyLogin(app);
        const student = await createStudent();

        const dto: CreateContractDto = {
          activities: 'activities string',
          startDate: new Date(1),
          endDate: new Date(2),
          studentId: student.id,
        };

        const { body } = await request(app.getHttpServer())
          .post(path)
          .set('Authorization', `Bearer ${token}`)
          .send(dto)
          .expect(201);

        expect(body.studentId).toEqual(student.id);
      });

      it('should return errors when dto is invalid', async () => {
        const token = await companyLogin(app);

        await request(app.getHttpServer())
          .post(path)
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .expect({
            statusCode: 400,
            message: [
              'Lista de atividades é obrigatória',
              'Data final deve ser uma data válida',
              'Data final é obrigatória',
              'Data de início deve ser uma data válida',
              'Data de início é obrigatória',
              'ID do aluno é obrigatório',
            ],
            error: 'Bad Request',
          });
      });
    });

    describe('When role is not company', () => {
      it('should return 401 if token is invalid', async () => {
        await request(app.getHttpServer())
          .post(path)
          .set('Authorization', 'Bearer invalid_token')
          .expect(401);
      });

      it('should return 403 if user is not admin', async () => {
        const token = await studentLogin(app);
        await request(app.getHttpServer())
          .post(path)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });
});
