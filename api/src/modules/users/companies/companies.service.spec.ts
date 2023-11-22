import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { CompaniesService } from './companies.service';
import { ImagesService } from '../../images/images.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto } from './create-company.dto';
import bcryptService from '../../../utils/bcriptUtils';

const companyDto = {
  password: '123456',
} as CreateCompanyDto;
const company = {} as Prisma.CompanyGetPayload<{}>;

describe('Companies Service', () => {
  let service: CompaniesService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        ImagesService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              create: jest.fn().mockResolvedValue(company),
              findUnique: jest.fn().mockResolvedValue(null),
              findMany: jest.fn().mockResolvedValue([company]),
              update: jest.fn().mockResolvedValue(company),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  describe('create()', () => {
    it('should throw error if email is already in use', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce({} as Prisma.CompanyGetPayload<{}>);

      await expect(service.createCompany(companyDto)).rejects.toThrow(
        new ConflictException('Email já cadastrado!'),
      );
    });

    it('should throw error if cnpj already used', async () => {
      jest
        .spyOn(service, 'findByCnpj')
        .mockResolvedValueOnce({} as Prisma.CompanyGetPayload<{}>);

      await expect(service.createCompany(companyDto)).rejects.toThrow(
        new ConflictException('CNPJ já cadastrado!'),
      );
    });

    it('should hash password', async () => {
      jest.spyOn(bcryptService, 'hash').mockResolvedValue('hashedPassword');
      await service.createCompany(companyDto);
      expect(bcryptService.hash).toHaveBeenCalledWith(companyDto.password);
    });
  });
});
