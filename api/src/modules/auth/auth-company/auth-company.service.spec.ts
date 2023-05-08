import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../../users/students/entities/student.entity';
import { StudentsService } from '../../users/students/services/students.service';
import { AuthCompanyService } from './auth-company.service';
import { CompaniesService } from '../../users/companies/services/companies.service';
import { Company } from '../../users/companies/entities/company.entity';

describe('AuthStudentService', () => {
  let service: AuthCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCompanyService,
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: CompaniesService, useValue: { findByEmail: jest.fn() } },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthCompanyService>(AuthCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCompany()', () => {
    it('should return null if company not found', async () => {
      jest
        .spyOn(service['companiesService'], 'findByEmail')
        .mockResolvedValueOnce(null);

      const user = await service.validateCompany('email', 'password');

      expect(user).toBeNull();
    });
  });
});
