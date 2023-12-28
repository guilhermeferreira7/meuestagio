import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { createManyAreas } from '../../../prisma/testing/factories/area';
import { get } from '../../helpers/request';

describe('[E2E] Areas', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET] /areas ', () => {
    it('should return all areas', async () => {
      const areas = await createManyAreas(5);
      const { body } = await get('/areas', app).expect(200);
      expect(body).toHaveLength(5);

      areas.forEach((area) => {
        expect(body).toContainEqual(area);
      });
    });
  });
});
