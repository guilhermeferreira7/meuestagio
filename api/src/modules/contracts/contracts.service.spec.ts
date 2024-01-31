import { Test, TestingModule } from '@nestjs/testing';
import { Company, Contract, Student } from '@prisma/client';

import { ContractsService } from './contracts.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateContractDto } from './dtos/create.dto';

describe('Contracts Service', () => {
  let service: ContractsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: PrismaService,
          useValue: {
            student: { findUnique: jest.fn().mockReturnValue({} as Student) },
            company: { findUnique: jest.fn().mockReturnValue({} as Company) },
            contract: {
              create: jest.fn().mockReturnValue({ id: 1 } as Contract),
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get<ContractsService>(ContractsService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isDatesValid()', () => {
    it('should throw error if endDate is older than startDate', async () => {
      const dto: CreateContractDto = {
        studentId: 1,
        companyId: 1,
        activities: 'activities',
        endDate: new Date(1),
        startDate: new Date(2),
      };

      try {
        await service.create(dto);
      } catch (e) {
        expect(e.message).toBe('A final precisa ser depois da data inicial');
      }
    });

    it('should not throw error if startDate is older then endDate', async () => {
      const dto: CreateContractDto = {
        studentId: 1,
        companyId: 1,
        activities: 'activities',
        endDate: new Date(2),
        startDate: new Date(1),
      };

      expect(await service.create(dto)).toEqual({ id: 1 });
    });
  });
});
