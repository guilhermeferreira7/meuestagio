import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import bcryptService from '../../../../utils/bcriptUtils';

const oneCompany = {
  name: 'company one',
  email: 'companyone@gmail.com',
  password: 'abc123',
  cnpj: '12345678901234',
  cityId: 1,
};

const mockCompaniesRepository = {
  findOneBy: jest.fn(() => undefined),
  create: jest.fn((dto) => dto),
  save: jest.fn((company) => Promise.resolve(company)),
};

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repository: Repository<Company>;

  const COMPANIES_REPOSITORY = getRepositoryToken(Company);
  const HASHED_PASS = 'hashedPass';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService],
    })
      .useMocker((token) => {
        switch (token) {
          case COMPANIES_REPOSITORY:
            return mockCompaniesRepository;
        }
      })
      .compile();

    service = module.get<CompaniesService>(CompaniesService);
    repository = module.get<Repository<Company>>(COMPANIES_REPOSITORY);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repositories should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should throw error if email is already in use', async () => {
      const company = await service.create(oneCompany);
      jest
        .spyOn(repository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(company));

      try {
        await service.create(oneCompany);
      } catch (error) {
        expect(error.message).toBe('Email já cadastrado!');
      }
    });

    it('should throw error if cnpj already used', async () => {
      const company = await service.create(oneCompany);
      jest
        .spyOn(repository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(company));

      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);
      try {
        await service.create({ ...oneCompany, email: 'empresa2@gmail.com' });
      } catch (error) {
        expect(error.message).toBe('CNPJ já cadastrado!');
      }
    });

    it('should hash password correctly', async () => {
      jest.spyOn(bcryptService, 'hash').mockResolvedValue(HASHED_PASS);
      await service.create(oneCompany);
      expect(repository.create).toHaveBeenCalledWith({
        ...oneCompany,
        password: HASHED_PASS,
      });
    });

    it('should call repository.create', async () => {
      await service.create(oneCompany);
      expect(repository.create).toHaveBeenCalledWith({
        ...oneCompany,
        password: HASHED_PASS,
      });
    });

    it('should call repository.save', async () => {
      await service.create(oneCompany);
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
