import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { AppModule } from '../../../../src/app.module';
import { CreateCompanyDto } from '../../../../src/modules/users/companies/create-company.dto';
import { UpdateCompanyDto } from '../../../../src/modules/users/companies/update-company.dto';
import { createCity, createCompany } from '../../../helpers/database-setup';
import { companyLogin, studentLogin } from '../../../helpers/login';

describe('[E2E] Company', () => {
  let app: INestApplication;
  const createCompanyPath = '/companies';
  const profilePath = '/companies/profile';

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

  describe(`[POST] ${createCompanyPath}`, () => {
    describe('When params are invalid', () => {
      it('should return a 400 if body is empty', async () => {
        await request(app.getHttpServer())
          .post(createCompanyPath)
          .send({})
          .expect(400);
      });

      it('should return a 400 if email is invalid', async () => {
        const companyDto: CreateCompanyDto = {
          name: 'Company Name',
          email: 'invalid-email',
          cnpj: faker.number.int({ min: 100000, max: 999999 }).toString(),
          cityId: faker.number.int({ min: 1, max: 100 }),
          password: faker.internet.password(),
        };

        await request(app.getHttpServer())
          .post(createCompanyPath)
          .send(companyDto)
          .expect({
            statusCode: 400,
            message: ['email must be an email'],
            error: 'Bad Request',
          });
      });

      it('should return a 400 if cnpj is empty', async () => {
        const companyDto: CreateCompanyDto = {
          name: 'Company Name',
          email: faker.internet.email(),
          cnpj: undefined,
          cityId: faker.number.int({ min: 1, max: 100 }),
          password: faker.internet.password(),
        };
        await request(app.getHttpServer())
          .post(createCompanyPath)
          .send(companyDto)
          .expect({
            statusCode: 400,
            message: ['cnpj should not be empty'],
            error: 'Bad Request',
          });
      });

      it('should return a 400 if password is empty', async () => {
        const companyDto: CreateCompanyDto = {
          name: 'Company Name',
          email: faker.internet.email(),
          cnpj: faker.number.int({ min: 100000, max: 999999 }).toString(),
          cityId: faker.number.int({ min: 1, max: 100 }),
          password: undefined,
        };
        await request(app.getHttpServer())
          .post(createCompanyPath)
          .send(companyDto)
          .expect({
            statusCode: 400,
            message: ['password should not be empty'],
            error: 'Bad Request',
          });
      });

      it('should return a 400 if city is invalid', async () => {
        const companyDto: CreateCompanyDto = {
          name: 'Company Name',
          email: faker.internet.email(),
          cnpj: faker.number.int({ min: 100000, max: 999999 }).toString(),
          cityId: 1,
          password: faker.internet.password(),
        };

        await request(app.getHttpServer())
          .post(createCompanyPath)
          .send(companyDto)
          .expect({
            statusCode: 400,
            message: 'Bad Request',
          });
      });
    });

    describe('When params are valid', () => {
      it('should create a company', async () => {
        const city = await createCity();

        const companyDto: CreateCompanyDto = {
          name: 'Company Name',
          email: faker.internet.email(),
          cnpj: faker.number.int({ min: 100000, max: 999999 }).toString(),
          cityId: city.id,
          password: faker.internet.password(),
        };

        const req = await request(app.getHttpServer())
          .post(createCompanyPath)
          .send(companyDto)
          .expect(201);

        expect(req.body).toHaveProperty('id');
      });
    });
  });
  describe('[GET] /companies/profile', () => {
    describe('When token is invalid', () => {
      it('should return a 401 Unauthorized if token not provided', async () => {
        await request(app.getHttpServer()).get(profilePath).expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });

      it('should return a 403 Forbidden if role is not company', async () => {
        const studentToken = await studentLogin(app);
        await request(app.getHttpServer())
          .get(profilePath)
          .set('Authorization', `Bearer ${studentToken}`)
          .expect({
            statusCode: 403,
            message: 'Forbidden resource',
            error: 'Forbidden',
          });
      });
    });

    describe('When token is valid', () => {
      it('should return a company profile if token is from company', async () => {
        const companyEmail = faker.internet.email();
        const companyToken = await companyLogin(app, companyEmail);

        const req = await request(app.getHttpServer())
          .get(profilePath)
          .set('Authorization', `Bearer ${companyToken}`)
          .expect(200);

        expect(req.body).toHaveProperty('email', companyEmail);
      });
    });
  });
  describe('[PATCH] /companies/profile', () => {
    describe('When token is invalid', () => {
      it('should return a 401 Unauthorized if token not provided', async () => {
        await request(app.getHttpServer()).patch(profilePath).expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });

      it('should return a 403 Forbidden if role is not company', async () => {
        const studentToken = await studentLogin(app);
        await request(app.getHttpServer())
          .patch(profilePath)
          .set('Authorization', `Bearer ${studentToken}`)
          .expect({
            statusCode: 403,
            message: 'Forbidden resource',
            error: 'Forbidden',
          });
      });
    });

    describe('When token is valid', () => {
      it('should update a company profile role is company', async () => {
        const companyToken = await companyLogin(app);

        const newCity = await createCity();
        const newCompanyDto: UpdateCompanyDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          cityId: newCity.id,
          password: faker.internet.password(),
        };

        const req = await request(app.getHttpServer())
          .patch(profilePath)
          .set('Authorization', `Bearer ${companyToken}`)
          .send(newCompanyDto)
          .expect(200);

        expect(req.body.user).toHaveProperty('sub', req.body.company.id);
        expect(req.body.company).toHaveProperty('email', newCompanyDto.email);
        expect(req.body.company).toHaveProperty('name', newCompanyDto.name);
        expect(req.body.company).toHaveProperty('phone', newCompanyDto.phone);
        expect(req.body.company).toHaveProperty('cityId', newCity.id);
        expect(req.body.company).not.toHaveProperty('password');
      });

      it('should not update a company profile if email is already in use', async () => {
        const emailOne = faker.internet.email();
        const emailTwo = faker.internet.email();

        const companyOneToken = await companyLogin(app, emailOne);
        await createCompany(emailTwo, '123123');

        await request(app.getHttpServer())
          .patch(profilePath)
          .set('Authorization', `Bearer ${companyOneToken}`)
          .send({ email: emailTwo })
          .expect({
            statusCode: 409,
            message: 'Email pertence a outro usuário',
            error: 'Conflict',
          });
      });
    });
  });
});
