import { Test, TestingModule } from '@nestjs/testing';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { CompaniesService } from '../services/companies.service';
import { CompaniesController } from './companies.controller';
import { BadRequestException } from '@nestjs/common';

const createCompanyDto: CreateCompanyDto = {
  name: 'company one',
  email: 'company@example.com',
  password: 'changeme',
  cnpj: '09249963000106',
  cityId: 1,
};

const mockService = {
  create: jest.fn((company) => Promise.resolve({ id: 1, ...company })),
};

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = app.get<CompaniesController>(CompaniesController);
    service = app.get<CompaniesService>(CompaniesService);

    jest.clearAllMocks();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should throw error if cnpj is invalid', async () => {
      const invalidCnpj = { ...createCompanyDto, cnpj: '12345678901234' };
      jest
        .spyOn(controller, 'create')
        .mockRejectedValueOnce(new BadRequestException('CNPJ inválido'));
      await expect(controller.create(invalidCnpj)).rejects.toThrow(
        'CNPJ inválido',
      );
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should create company', async () => {
      const createCompany = await controller.create(createCompanyDto);
      expect(createCompany).toEqual({ id: 1, ...createCompanyDto });
      expect(service.create).toHaveBeenCalledWith(createCompanyDto);
    });
  });
});
