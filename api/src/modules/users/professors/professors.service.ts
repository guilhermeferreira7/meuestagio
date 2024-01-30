import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateProfessorDto } from './professor-create.dto';
import bcryptService from '../../../utils/bcriptUtils';

@Injectable()
export class ProfessorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateProfessorDto) {
    await this.validateCreate(body);

    const password = await bcryptService.hash(body.password);

    return await this.prisma.professor.create({
      data: {
        ...body,
        password,
      },
    });
  }

  async findOne(email: string) {
    return await this.prisma.professor.findUnique({
      where: {
        email,
      },
    });
  }

  async findOneWithAllData(email: string) {
    return await this.prisma.professor.findUnique({
      where: {
        email,
      },
      include: { course: { include: { institution: true } } },
    });
  }

  private async validateCreate(body: CreateProfessorDto) {
    const professor = await this.prisma.professor.findUnique({
      where: {
        email: body.email,
      },
    });

    if (professor) throw new ConflictException('Professor já cadastrado');

    const course = await this.prisma.course.findUnique({
      where: {
        id: body.courseId,
      },
    });

    if (!course) throw new BadRequestException('Curso não encontrado');
  }
}
