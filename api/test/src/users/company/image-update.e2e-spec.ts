import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { TestModule } from '../../../test.module';
import { companyLogin } from '../../../helpers/login';

describe('CompanyImageUpdate', () => {
  let app: INestApplication;
  let imageUpdatePath = '/companies/profile/image';
  let token = '';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    token = await companyLogin(module, app);
  });

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
