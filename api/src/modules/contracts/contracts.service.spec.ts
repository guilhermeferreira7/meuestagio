import { beforeEach } from 'node:test';
import { Test, TestingModule } from '@nestjs/testing';

import { ContractsService } from './contracts.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateContractDto } from './dtos/create';

describe('Contracts Service', () => {
  let service: ContractsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ContractsService,
          useValue: {
            create: jest.fn(),
            studentExists: jest.fn(() => true),
            companyExists: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<ContractsService>(ContractsService);
  });

  describe('isDatesValid()', () => {
    it('should return false if endDate is older than startDate', async () => {
      const dto: CreateContractDto = {
        studentId: 1,
        companyId: 1,
        activities: 'activities',
        endDate: new Date(1),
        startDate: new Date(2),
        isEnded: false,
      };

      console.log('dto', dto);

      await service.create(dto);
    });
  });
});
