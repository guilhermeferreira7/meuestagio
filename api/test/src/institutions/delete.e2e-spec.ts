import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { adminLogin, studentLogin } from '../../helpers/login';
import { prisma } from '../../../prisma/prisma';
import { createInstitution } from '../../../prisma/factories/institution';

describe('[E2E] Institution', () => {
  let app: INestApplication;
  const endpoint = '/institutions';

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
    await prisma.institution.deleteMany();
  });

  describe('[DELETE] /institutions', () => {
    describe('When user is admin', () => {
      it('should delete an institution', async () => {
        const token = await adminLogin(app);
        const { id } = await createInstitution();

        await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then((response) => {
            expect(response.body).toHaveLength(1);
          });

        await request(app.getHttpServer())
          .delete(`${endpoint}/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then((response) => {
            expect(response.body).toHaveLength(0);
          });
      });

      it('should return 404 if institution does not exist', async () => {
        const token = await adminLogin(app);
        await request(app.getHttpServer())
          .delete(`${endpoint}/1`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
    });

    describe('When user is not admin', () => {
      it('should return 403', async () => {
        const token = await studentLogin(app);
        await request(app.getHttpServer())
          .delete(`${endpoint}/1`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('should return 401 if token is invalid', async () => {
        await request(app.getHttpServer()).delete(`${endpoint}/1`).expect(401);
      });
    });
  });
});
