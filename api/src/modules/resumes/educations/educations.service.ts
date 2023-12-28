import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateEducationDto } from './create.dto';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class EducationsService {
  constructor(private readonly prisma: PrismaService) {}

  async add(body: CreateEducationDto, email: string) {
    const resume = await this.validateEducation(body, email);
    return await this.prisma.education.create({
      data: {
        ...body,
        resume: {
          connect: resume,
        },
      },
    });
  }

  async getAll(email: string) {
    const resume = await this.getResume(email);
    return await this.prisma.education.findMany({
      where: {
        resumeId: resume.id,
      },
    });
  }

  async delete(id: number, email: string) {
    const resume = await this.getResume(email);
    const education = await this.prisma.education.findFirst({
      where: {
        id,
        resumeId: resume.id,
      },
    });
    if (!education) throw new NotFoundException('Formação não encontrada');

    await this.prisma.education.delete({
      where: {
        id,
      },
    });
  }

  private async getResume(email: string) {
    const student = await this.prisma.student.findUnique({ where: { email } });
    return await this.prisma.resume.findUnique({
      where: { studentId: student.id },
    });
  }

  private async validateEducation(body: CreateEducationDto, email: string) {
    const resume = await this.getResume(email);
    if (!resume) throw new NotFoundException('Currículo não encontrado');

    const educationExists = await this.prisma.education.findFirst({
      where: {
        resumeId: resume.id,
        school: body.school,
      },
    });

    if (educationExists) throw new ConflictException('Formação já cadastrada');

    return resume;
  }
}
