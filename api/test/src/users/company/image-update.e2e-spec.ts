import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { companyLogin } from '../../../helpers/login';
import { AppModule } from '../../../../src/app.module';
import { clearDatabase } from '../../../helpers/database-setup';

describe('[E2E] Company Image Update', () => {
  let app: INestApplication;
  let imageUpdatePath = '/companies/profile/image';
  let token = '';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    token = await companyLogin(app);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe(`[POST] ${imageUpdatePath}`, () => {
    it(`should update the company's image`, async () => {
      const req = await request(app.getHttpServer())
        .post(imageUpdatePath)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', `${__dirname}/image.jpg`)
        .expect(201);

      expect(req.body.imageUrl).toBeDefined();
    });
  });
});
