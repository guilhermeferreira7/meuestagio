import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { CreateRegionDto } from '../../../src/modules/cities/dtos/create-region.dto';
import { clearDatabase } from '../../helpers/database-setup';
import { post } from '../../helpers/request';
import { adminLogin, studentLogin } from '../../helpers/login';

describe('[E2E] cities/regions post', () => {
  let app: INestApplication;
  const path = '/cities/regions';

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

  describe('[POST] /cities/regions', () => {
    describe('When user is admin', () => {
      describe('When dto is valid', () => {
        it('should create and return a region', async () => {
          const token = await adminLogin(app);
          const dto: CreateRegionDto = {
            name: 'Test Region',
            IBGECode: 123,
            state: 'Paraná',
          };

          const { body } = await post(path, app, token, dto).expect(201);

          expect(body.name).toBe(dto.name);
          expect(body.state).toBe(dto.state);
          expect(body.IBGECode).toBe(dto.IBGECode);
        });

        it('should not create a region with same name', async () => {
          const token = await adminLogin(app);
          const dto: CreateRegionDto = {
            name: 'Test Region',
            IBGECode: 123,
            state: 'Paraná',
          };

          await post(path, app, token, dto).expect(201);
          await post(path, app, token, { ...dto, IBGECode: 321 }).expect(409);
        });
      });

      describe('When dto is invalid', () => {
        it('should return errors', async () => {
          const token = await adminLogin(app);
          await post(path, app, token, {}).expect({
            statusCode: 400,
            message: [
              'IBGECode should not be empty',
              'name should not be empty',
              'state should not be empty',
            ],
            error: 'Bad Request',
          });
        });
      });
    });
    describe('When user is not admin', () => {
      it('should return 401 if token is not valid', async () => {
        await post(path, app, 'invalid-token').expect(401);
      });
      it('should return 403 if user is not admin', async () => {
        const token = await studentLogin(app);
        await post(path, app, token).expect(403);
      });
    });
  });
});
