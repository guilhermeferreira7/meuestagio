import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dtos/create';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContractDto) {
    if (!this.isValid(dto)) throw new BadRequestException();

    return this.prisma.contract.create({
      data: {
        ...dto,
        isEnded: false,
      },
    });
  }

  private isValid(dto: CreateContractDto) {
    if (
      !this.studentExists(dto.studentId) ||
      !this.companyExists(dto.companyId)
    )
      throw new BadRequestException();

    if (!this.isDatesValid(dto.startDate, dto.endDate)) {
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

  private isDatesValid(startDate: Date, endDate: Date) {
    return endDate > startDate;
  }
}
