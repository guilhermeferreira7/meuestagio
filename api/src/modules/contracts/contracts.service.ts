import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateContractDto } from './dtos/create.dto';
import { PrismaService } from '../../../prisma/prisma.service';

type CreateContract = CreateContractDto & { companyId: number };

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateContract) {
    if (!this.isValid(data)) throw new BadRequestException();

    return this.prisma.contract.create({
      data: {
        ...data,
        isEnded: false,
      },
    });
  }

  private isValid(data: CreateContract) {
    const student = this.studentExists(data.studentId);
    const company = this.companyExists(data.companyId);

    if (!student || !company) throw new BadRequestException();

    if (!this.isDatesValid(data.startDate, data.endDate)) {
      throw new BadRequestException(
        'A final precisa ser depois da data inicial',
      );
    }

    return true;
  }

  private studentExists(studentId: number) {
    return this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
  }

  private companyExists(companyId: number) {
    return this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
  }

  private isDatesValid(startDate: Date | string, endDate: Date | string) {
    return endDate > startDate;
  }
}
