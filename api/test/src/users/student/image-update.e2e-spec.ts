import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { studentLogin } from '../../../helpers/login';
import { AppModule } from '../../../../src/app.module';

describe('[E2E] Student Image Update', () => {
  let app: INestApplication;
  let imageUpdatePath = '/students/profile/image';
  let token = '';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    token = await studentLogin(app);
  });

  describe(`[POST] ${imageUpdatePath}`, () => {
    it(`should update the student's image and return the image url`, async () => {
      const image = `${__dirname}/avatar.jpg`;

      const req = await request(app.getHttpServer())
        .post(imageUpdatePath)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', image)
        .expect(201);

      expect(req.body.imageUrl).toBeDefined();
    });
  });
});
